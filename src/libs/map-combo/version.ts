import type { MapComboData } from "@/libs/map-combo";
import { useQuery } from "@tanstack/react-query";

const versionDataMap: Record<string, () => Promise<MapComboData>> = {
  demo: async () =>
    (await import("@/data/map-combo-data-v3.json")).default as MapComboData,
};

export const versionKeys = Object.keys(versionDataMap);

export function useVersionData(version: string | undefined) {
  return useQuery({
    queryKey: ["map-combo-data", version],
    queryFn: () => {
      const query = version ? versionDataMap[version] : undefined;
      return query?.();
    },
  });
}
