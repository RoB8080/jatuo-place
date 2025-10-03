import {
  createContext,
  type ReactNode,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  useVersionData,
  versionKeys,
  usePersistState,
  type MapComboData,
  type Mod,
  type ModCategory,
  type ModFile,
  evaluateCondition,
} from "@/libs/map-combo";
import { uniq } from "es-toolkit";

/** mod data with its related files */
export type DataTreeMod = Mod & {
  files: ModFile[];
};

/** category data with its related mods */
export type DataTreeCategory = ModCategory & {
  mods: DataTreeMod[];
};

/** Tree like data, category -> mod -> mod file */
export type DataTree = DataTreeCategory[];

export interface MapComboContextValue {
  // version
  availableVersionKeys: string[];
  selectedVersionKey: string | undefined;
  setSelectedVersionKey: (version: string | undefined) => void;
  isLoadingVersionData: boolean;
  // mod tree
  dataTree: DataTree;
  expandedCategoryIDs: string[];
  toggleCategory: (categoryID: string) => void;
  expandCategories: (categoryIDs: string[]) => void;
  collapseCategories: (categoryIDs: string[]) => void;
  // selection
  selectedModIDs: string[];
  selectMods: (modIDs: string[]) => void;
  unselectMods: (modIDs: string[]) => void;
  // mod list
  activatedModFiles: ActivatedModFile[];
  // mod map
  modMap: Map<string, Mod>;
}

const MapComboContext = createContext<MapComboContextValue>({
  availableVersionKeys: versionKeys,
  selectedVersionKey: undefined,
  setSelectedVersionKey: () => {},
  isLoadingVersionData: false,
  dataTree: [],
  expandedCategoryIDs: [],
  toggleCategory: () => {},
  expandCategories: () => {},
  collapseCategories: () => {},
  selectedModIDs: [],
  selectMods: () => {},
  unselectMods: () => {},
  activatedModFiles: [],
  modMap: new Map(),
});

function buildDataTree(data: MapComboData | undefined): DataTree {
  const { categories = [], mods = [], files = [] } = data || {};

  const categoryMap = new Map<ModCategory["id"], DataTreeCategory>(
    categories.map((category) => [
      category.id,
      { ...structuredClone(category), mods: [] },
    ]),
  );
  const modMap = new Map<Mod["id"], DataTreeMod>(
    mods.map((mod) => [mod.id, { ...structuredClone(mod), files: [] }]),
  );
  const seenModIDSet = new Set();
  const seenCategoryIDSet = new Set();

  return files.reduce<DataTree>((data, file) => {
    const mod = modMap.get(file.modID);
    if (!mod) {
      return data; // mod not found, skip
    }
    mod.files.push(file);

    // seen mod has already added to category, skip
    if (seenModIDSet.has(mod.id)) {
      return data;
    }
    seenModIDSet.add(mod.id);

    const category = categoryMap.get(mod.categoryID);
    if (!category) {
      return data; // category not found, skip
    }
    category.mods.push(mod);

    // seen category has already added to data tree, skip
    if (seenCategoryIDSet.has(category.id)) {
      return data;
    }
    seenCategoryIDSet.add(category.id);
    data.push(category);

    return data;
  }, []);
}

export type ActivatedModFile = ModFile & {
  mod?: Mod;
};

function buildActivatedModFileList(
  selectedModIDs: string[],
  mods: Mod[],
  files: ModFile[],
): ActivatedModFile[] {
  return files
    .filter((file) => {
      if (!file.condition) {
        return true;
      }
      const isConditionSatisfied = evaluateCondition(
        file.condition,
        new Set(selectedModIDs),
      );
      return isConditionSatisfied;
    })
    .map((file) => ({
      ...file,
      mod: mods.find((mod) => mod.id === file.modID),
    }));
}

export function MapComboProvider({ children }: { children: ReactNode }) {
  const {
    selectedVersionKey,
    setSelectedVersionKey,
    expandedCategoryIDs,
    setExpandedCategoryIDs,
    selectedModIDs,
    setSelectedModIDs,
  } = usePersistState();

  const { data: versionData, isLoading: isLoadingVersionData } =
    useVersionData(selectedVersionKey);

  const dataTree = useMemo(
    () => (versionData ? buildDataTree(versionData) : []),
    [versionData],
  );

  const toggleCategory = useCallback(
    (categoryID: string) => {
      setExpandedCategoryIDs((prev) =>
        uniq(
          (prev || []).includes(categoryID)
            ? (prev || []).filter((id) => id !== categoryID)
            : [...(prev || []), categoryID],
        ),
      );
    },
    [setExpandedCategoryIDs],
  );

  const expandCategories = useCallback(
    (categoryIDs: string[]) => {
      setExpandedCategoryIDs((prev) => uniq([...(prev || []), ...categoryIDs]));
    },
    [setExpandedCategoryIDs],
  );

  const collapseCategories = useCallback(
    (categoryIDs: string[]) => {
      setExpandedCategoryIDs((prev) =>
        uniq((prev || []).filter((id) => !categoryIDs.includes(id))),
      );
    },
    [setExpandedCategoryIDs],
  );

  const selectMods = useCallback(
    (modIDs: string[]) => {
      setSelectedModIDs((prev) => uniq([...(prev || []), ...modIDs]));
    },
    [setSelectedModIDs],
  );

  const unselectMods = useCallback(
    (modIDs: string[]) => {
      setSelectedModIDs((prev) =>
        uniq((prev || []).filter((id) => !modIDs.includes(id))),
      );
    },
    [setSelectedModIDs],
  );

  const activatedModFiles = useMemo(
    () =>
      buildActivatedModFileList(
        selectedModIDs,
        versionData?.mods || [],
        versionData?.files || [],
      ),
    [selectedModIDs, versionData?.mods, versionData?.files],
  );

  const modMap = useMemo(() => {
    const map = new Map<string, Mod>();
    (versionData?.mods || []).forEach((mod) => {
      map.set(mod.id, mod);
    });
    return map;
  }, [versionData?.mods]);

  return (
    <MapComboContext.Provider
      value={{
        availableVersionKeys: versionKeys,
        selectedVersionKey,
        setSelectedVersionKey,
        isLoadingVersionData,
        dataTree,
        expandedCategoryIDs,
        toggleCategory,
        expandCategories,
        collapseCategories,
        selectedModIDs,
        selectMods,
        unselectMods,
        activatedModFiles,
        modMap,
      }}
    >
      {children}
    </MapComboContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMapComboContext() {
  return useContext(MapComboContext);
}
