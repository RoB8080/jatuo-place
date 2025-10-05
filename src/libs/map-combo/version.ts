import type { MapComboData } from "@/libs/map-combo";
import { useQuery } from "@tanstack/react-query";
import { usePersistState } from "@/libs/common";

const versionDataMap: Record<string, () => Promise<MapComboData>> = {
  demo: async () => (await import("@/data/demo.json")).default as MapComboData,
};

export const versionKeys = Object.keys(versionDataMap);

const MAP_COMBO_SELECTED_VERSION_KEY = "map-combo:selected-version";

/**
 * Load map combo data for the specified version
 *
 * @param versionKey Version key
 * @returns Map combo data Promise
 */
export async function loadVersionData(
  versionKey: string,
): Promise<MapComboData | undefined> {
  return versionDataMap[versionKey]?.();
}

/**
 * Unified version management Hook
 *
 * Provides version selection persistence and version data retrieval functionality
 *
 * @returns Version-related state and operation functions
 */
export function useVersion() {
  // Persist version selection
  const [selectedVersionKey, setSelectedVersionKey] = usePersistState<
    string | undefined
  >(MAP_COMBO_SELECTED_VERSION_KEY, undefined);

  // Get version data
  const { data: versionData, isLoading: isLoadingVersionData } = useQuery({
    queryKey: ["map-combo-data", selectedVersionKey],
    queryFn: () => {
      return selectedVersionKey
        ? loadVersionData(selectedVersionKey)
        : undefined;
    },
  });

  return {
    // Version selection
    selectedVersionKey,
    setSelectedVersionKey,
    availableVersionKeys: versionKeys,

    // Version data
    versionData,
    isLoadingVersionData,
  };
}
