import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import { usePersistState } from "@/libs/common";
import { uniq } from "es-toolkit";
import type { Mod, MapComboData } from "./types";
import {
  evaluateCondition,
  getReferencedMods,
  type Condition,
} from "./condition";

export const MAP_COMBO_SELECTED_MOD_IDS_BASE_KEY = "map-combo:selected-mod-ids";
export const MAP_COMBO_EXPANDED_CATEGORY_IDS_BASE_KEY =
  "map-combo:expanded-category-ids";

/**
 * Mod 冲突信息
 */
export interface ModConflict {
  /** 冲突的 mod ID */
  modID: string;
  /** 冲突原因 */
  reason: "incompatible" | "dependency_failed";
  /** 相关的条件或依赖 */
  relatedCondition?: Condition;
}

/**
 * 选择验证结果
 */
export interface SelectionValidationResult {
  /** 是否有效 */
  isValid: boolean;
  /** 有效的 mod 列表 */
  validMods: string[];
  /** 被移除的 mod 列表 */
  removedMods: string[];
  /** 冲突信息 */
  conflicts: ModConflict[];
}

/**
 * 获取与指定 mod 冲突的已选择 mod 列表
 */
function getConflictingMods(
  targetModID: string,
  selectedModIDs: string[],
  allMods: Mod[],
): ModConflict[] {
  const conflicts: ModConflict[] = [];
  const targetMod = allMods.find((mod) => mod.id === targetModID);

  if (!targetMod) return conflicts;

  // 检查目标 mod 的条件是否与已选择的 mod 冲突
  if (targetMod.condition) {
    const referencedMods = getReferencedMods(targetMod.condition);

    // 检查是否有 NOT 条件与已选择的 mod 冲突
    const hasNotCondition = (condition: Condition): boolean => {
      if (condition.type === "not") {
        if (condition.condition.type === "mod") {
          return selectedModIDs.includes(condition.condition.value);
        }
        return hasNotCondition(condition.condition);
      }
      if (condition.type === "and" || condition.type === "or") {
        return condition.conditions.some(hasNotCondition);
      }
      return false;
    };

    if (hasNotCondition(targetMod.condition)) {
      // 找出具体冲突的 mod
      referencedMods.forEach((modID) => {
        if (selectedModIDs.includes(modID)) {
          conflicts.push({
            modID,
            reason: "incompatible",
            relatedCondition: targetMod.condition,
          });
        }
      });
    }
  }

  // 检查已选择的 mod 是否与目标 mod 冲突
  selectedModIDs.forEach((selectedModID) => {
    const selectedMod = allMods.find((mod) => mod.id === selectedModID);
    if (!selectedMod?.condition) return;

    const referencedMods = getReferencedMods(selectedMod.condition);
    if (referencedMods.includes(targetModID)) {
      // 检查是否是 NOT 条件
      const hasNotConditionForTarget = (condition: Condition): boolean => {
        if (condition.type === "not") {
          if (condition.condition.type === "mod") {
            return condition.condition.value === targetModID;
          }
          return hasNotConditionForTarget(condition.condition);
        }
        if (condition.type === "and" || condition.type === "or") {
          return condition.conditions.some(hasNotConditionForTarget);
        }
        return false;
      };

      if (hasNotConditionForTarget(selectedMod.condition)) {
        conflicts.push({
          modID: selectedModID,
          reason: "incompatible",
          relatedCondition: selectedMod.condition,
        });
      }
    }
  });

  return conflicts;
}

/**
 * 获取依赖于指定 mod 的其他 mod 列表
 */
function getDependentMods(
  targetModID: string,
  selectedModIDs: string[],
  allMods: Mod[],
): ModConflict[] {
  const dependents: ModConflict[] = [];

  selectedModIDs.forEach((selectedModID) => {
    if (selectedModID === targetModID) return;

    const selectedMod = allMods.find((mod) => mod.id === selectedModID);
    if (!selectedMod?.condition) return;

    // 检查这个 mod 是否依赖于目标 mod
    const referencedMods = getReferencedMods(selectedMod.condition);
    if (referencedMods.includes(targetModID)) {
      // 检查是否是正向依赖（不是 NOT 条件）
      const hasPositiveDependency = (condition: Condition): boolean => {
        if (condition.type === "mod") {
          return condition.value === targetModID;
        }
        if (condition.type === "and") {
          return condition.conditions.some(hasPositiveDependency);
        }
        if (condition.type === "or") {
          return condition.conditions.some(hasPositiveDependency);
        }
        if (condition.type === "not") {
          // NOT 条件不算正向依赖
          return false;
        }
        return false;
      };

      if (hasPositiveDependency(selectedMod.condition)) {
        dependents.push({
          modID: selectedModID,
          reason: "dependency_failed",
          relatedCondition: selectedMod.condition,
        });
      }
    }
  });

  return dependents;
}

/**
 * 验证并解决 mod 选择冲突
 */
function validateAndResolveSelection(
  newModIDs: string[],
  currentSelection: string[],
  allMods: Mod[],
): SelectionValidationResult {
  const conflicts: ModConflict[] = [];
  const removedMods: string[] = [];
  let validSelection = [...currentSelection];

  // 对每个新选择的 mod 检查冲突
  newModIDs.forEach((newModID) => {
    const modConflicts = getConflictingMods(newModID, validSelection, allMods);

    modConflicts.forEach((conflict) => {
      if (!removedMods.includes(conflict.modID)) {
        removedMods.push(conflict.modID);
        conflicts.push(conflict);
        validSelection = validSelection.filter((id) => id !== conflict.modID);
      }
    });

    // 添加新 mod 到有效选择中
    if (!validSelection.includes(newModID)) {
      validSelection.push(newModID);
    }
  });

  // 验证最终选择的有效性
  const finalValidMods: string[] = [];
  validSelection.forEach((modID) => {
    const mod = allMods.find((m) => m.id === modID);
    if (!mod?.condition) {
      finalValidMods.push(modID);
      return;
    }

    // 检查条件是否满足
    if (evaluateCondition(mod.condition, new Set(validSelection))) {
      finalValidMods.push(modID);
    } else {
      // 如果条件不满足，添加到移除列表
      if (!removedMods.includes(modID)) {
        removedMods.push(modID);
        conflicts.push({
          modID,
          reason: "dependency_failed",
          relatedCondition: mod.condition,
        });
      }
    }
  });

  return {
    isValid: conflicts.length === 0,
    validMods: uniq(finalValidMods),
    removedMods: uniq(removedMods),
    conflicts,
  };
}

/**
 * 验证并解决 mod 取消选择的依赖冲突
 */
function validateAndResolveUnselection(
  unselectedModIDs: string[],
  currentSelection: string[],
  allMods: Mod[],
): SelectionValidationResult {
  const conflicts: ModConflict[] = [];
  const removedMods: string[] = [...unselectedModIDs];
  let validSelection = currentSelection.filter(
    (id) => !unselectedModIDs.includes(id),
  );

  // 递归检查依赖关系
  const checkDependencies = (removedModIDs: string[]) => {
    const newlyRemoved: string[] = [];

    removedModIDs.forEach((removedModID) => {
      const dependents = getDependentMods(
        removedModID,
        validSelection,
        allMods,
      );

      dependents.forEach((dependent) => {
        if (!removedMods.includes(dependent.modID)) {
          removedMods.push(dependent.modID);
          conflicts.push(dependent);
          validSelection = validSelection.filter(
            (id) => id !== dependent.modID,
          );
          newlyRemoved.push(dependent.modID);
        }
      });
    });

    // 如果有新移除的 mod，继续检查它们的依赖
    if (newlyRemoved.length > 0) {
      checkDependencies(newlyRemoved);
    }
  };

  // 开始检查依赖关系
  checkDependencies(unselectedModIDs);

  return {
    isValid: conflicts.length === 0,
    validMods: uniq(validSelection),
    removedMods: uniq(removedMods),
    conflicts,
  };
}

/**
 * 统一的 mod 选择管理 Hook
 *
 * 整合持久化存储、兼容性检查和业务逻辑
 *
 * @param versionKey 当前选中的版本 key
 * @param versionData 当前版本的数据
 * @returns mod 选择状态和操作函数
 */
export function useModSelection(
  versionKey: string | undefined,
  versionData: MapComboData | undefined,
) {
  // 持久化存储
  const selectedModIDsKey = versionKey
    ? `${MAP_COMBO_SELECTED_MOD_IDS_BASE_KEY}:${versionKey}`
    : `${MAP_COMBO_SELECTED_MOD_IDS_BASE_KEY}:default`;

  const expandedCategoryIDsKey = versionKey
    ? `${MAP_COMBO_EXPANDED_CATEGORY_IDS_BASE_KEY}:${versionKey}`
    : `${MAP_COMBO_EXPANDED_CATEGORY_IDS_BASE_KEY}:default`;

  const [selectedModIDs, setSelectedModIDsRaw] = usePersistState<string[]>(
    selectedModIDsKey,
    [],
  );

  const [expandedCategoryIDs, setExpandedCategoryIDsRaw] = usePersistState<
    string[]
  >(expandedCategoryIDsKey, []);

  const allMods = useMemo(() => versionData?.mods || [], [versionData?.mods]);

  // 智能选择 mod（带冲突解决）
  const selectMods = useCallback(
    (modIDs: string[]) => {
      if (!versionData) return;

      const validation = validateAndResolveSelection(
        modIDs,
        selectedModIDs,
        allMods,
      );

      setSelectedModIDsRaw(validation.validMods);

      // TODO: 可以在这里添加用户通知逻辑
      if (validation.removedMods.length > 0) {
        console.log("自动移除冲突的 mod:", validation.removedMods);
        console.log("冲突详情:", validation.conflicts);
      }
    },
    [selectedModIDs, allMods, versionData, setSelectedModIDsRaw],
  );

  // 取消选择 mod（带依赖检查）
  const unselectMods = useCallback(
    (modIDs: string[]) => {
      if (!versionData) return;

      const validation = validateAndResolveUnselection(
        modIDs,
        selectedModIDs,
        allMods,
      );

      setSelectedModIDsRaw(validation.validMods);

      // TODO: 可以在这里添加用户通知逻辑
      if (validation.removedMods.length > modIDs.length) {
        const additionallyRemoved = validation.removedMods.filter(
          (id) => !modIDs.includes(id),
        );
        console.log("由于依赖关系，额外移除的 mod:", additionallyRemoved);
        console.log("依赖冲突详情:", validation.conflicts);
      }
    },
    [selectedModIDs, allMods, versionData, setSelectedModIDsRaw],
  );

  // 切换单个 mod 选择状态
  const toggleMod = useCallback(
    (modID: string) => {
      if (selectedModIDs.includes(modID)) {
        unselectMods([modID]);
      } else {
        selectMods([modID]);
      }
    },
    [selectedModIDs, selectMods, unselectMods],
  );

  // 分类操作
  const setExpandedCategoryIDs = useCallback<
    Dispatch<SetStateAction<string[]>>
  >(
    (valueOrUpdater) => {
      setExpandedCategoryIDsRaw(valueOrUpdater);
    },
    [setExpandedCategoryIDsRaw],
  );

  const toggleCategory = useCallback(
    (categoryID: string) => {
      setExpandedCategoryIDs((prev) =>
        prev.includes(categoryID)
          ? prev.filter((id) => id !== categoryID)
          : [...prev, categoryID],
      );
    },
    [setExpandedCategoryIDs],
  );

  const expandCategories = useCallback(
    (categoryIDs: string[]) => {
      setExpandedCategoryIDs((prev) => uniq([...prev, ...categoryIDs]));
    },
    [setExpandedCategoryIDs],
  );

  const collapseCategories = useCallback(
    (categoryIDs: string[]) => {
      setExpandedCategoryIDs((prev) =>
        prev.filter((id) => !categoryIDs.includes(id)),
      );
    },
    [setExpandedCategoryIDs],
  );

  // 兼容性检查工具函数
  const getIncompatibleMods = useCallback(
    (modID: string): string[] => {
      const conflicts = getConflictingMods(modID, selectedModIDs, allMods);
      return conflicts.map((conflict) => conflict.modID);
    },
    [selectedModIDs, allMods],
  );

  const validateSelection = useCallback(
    (modIDs: string[]): SelectionValidationResult => {
      return validateAndResolveSelection(modIDs, selectedModIDs, allMods);
    },
    [selectedModIDs, allMods],
  );

  return {
    // 基础状态
    selectedModIDs,
    expandedCategoryIDs,

    // mod 选择操作（带兼容性检查）
    selectMods,
    unselectMods,
    toggleMod,

    // 分类操作
    setExpandedCategoryIDs,
    toggleCategory,
    expandCategories,
    collapseCategories,

    // 兼容性检查工具
    getIncompatibleMods,
    validateSelection,
  };
}
