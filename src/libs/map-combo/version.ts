import type { MapComboData } from "@/libs/map-combo";
import { useQuery } from "@tanstack/react-query";
import { usePersistState } from "@/libs/common";

const versionDataMap: Record<string, () => Promise<MapComboData>> = {
  demo: async () =>
    (await import("@/data/map-combo-data-v3.json")).default as MapComboData,
};

export const versionKeys = Object.keys(versionDataMap);

export const MAP_COMBO_SELECTED_VERSION_KEY = "map-combo:selected-version";

/**
 * 统一的版本管理 Hook
 *
 * 提供版本选择的持久化和版本数据的获取功能
 *
 * @returns 版本相关的状态和操作函数
 */
export function useVersion() {
  // 持久化版本选择
  const [selectedVersionKey, setSelectedVersionKey] = usePersistState<
    string | undefined
  >(MAP_COMBO_SELECTED_VERSION_KEY, undefined);

  // 获取版本数据
  const { data: versionData, isLoading: isLoadingVersionData } = useQuery({
    queryKey: ["map-combo-data", selectedVersionKey],
    queryFn: () => {
      const query = selectedVersionKey
        ? versionDataMap[selectedVersionKey]
        : undefined;
      return query?.();
    },
  });

  return {
    // 版本选择
    selectedVersionKey,
    setSelectedVersionKey,
    availableVersionKeys: versionKeys,

    // 版本数据
    versionData,
    isLoadingVersionData,
  };
}
