import { useAtomValue } from "jotai";
import { useCallback } from "react";
import { useDataEditorContext, type DerivedAtoms } from "../root";
import type { ModCategory, Mod, ModFile } from "@/libs/map-combo";

// 派生读取 hooks
export function useCategories(): ModCategory[] {
  const { categoriesAtom } = useDataEditorAtoms();
  return useAtomValue(categoriesAtom) as ModCategory[];
}

export function useMods(): Mod[] {
  const { modsAtom } = useDataEditorAtoms();
  return useAtomValue(modsAtom) as Mod[];
}

export function useFiles(): ModFile[] {
  const { filesAtom } = useDataEditorAtoms();
  return useAtomValue(filesAtom) as ModFile[];
}

export function useModsByCategory(categoryID: string): Mod[] {
  const { modsByCategoryFamily } = useDataEditorAtoms();
  return useAtomValue(modsByCategoryFamily(categoryID));
}

export function useFilesByMod(modID: string): ModFile[] {
  const { filesByModFamily } = useDataEditorAtoms();
  return useAtomValue(filesByModFamily(modID));
}

export function useNomadMods(): Mod[] {
  const { nomadModsAtom } = useDataEditorAtoms();
  return useAtomValue(nomadModsAtom) as Mod[];
}

export function useNomadFiles(): ModFile[] {
  const { nomadFilesAtom } = useDataEditorAtoms();
  return useAtomValue(nomadFilesAtom) as ModFile[];
}

// ID 生成工具
function nextNewCategoryID(categories: ModCategory[]): string {
  let max = 0;
  categories.forEach((cat) => {
    const m = cat.id.match(/^new_category_(\d+)$/);
    if (m) {
      const n = parseInt(m[1]);
      if (n > max) max = n;
    }
  });
  return `new_category_${max + 1}`;
}

function nextNewModID(mods: Mod[]): string {
  let max = 0;
  mods.forEach((mod) => {
    const m = mod.id.match(/^new_mod_(\d+)$/);
    if (m) {
      const n = parseInt(m[1]);
      if (n > max) max = n;
    }
  });
  return `new_mod_${max + 1}`;
}

function nextNewFileName(files: ModFile[]): string {
  let max = 0;
  files.forEach((file) => {
    const m = file.name.match(/^New File (\d+)$/);
    if (m) {
      const n = parseInt(m[1]);
      if (n > max) max = n;
    }
  });
  return `New File ${max + 1}`;
}

// 操作 hooks（通过 setWorkingData 写入）
export function useCreateCategory() {
  const { setWorkingData } = useDataEditorContext();
  const create = useCallback((): ModCategory => {
    let created: ModCategory | null = null;
    setWorkingData((prev) => {
      const id = nextNewCategoryID(prev.categories);
      created = { id, name: { en: `New Category ${id.split("_").pop()}` } };
      return { ...prev, categories: [...prev.categories, created!] };
    });
    return created!;
  }, [setWorkingData]);
  return create;
}

export function useDeleteCategory() {
  const { setWorkingData } = useDataEditorContext();
  const remove = useCallback(
    (categoryID: string) => {
      setWorkingData((prev) => {
        const categories = prev.categories.filter((c) => c.id !== categoryID);
        const mods = prev.mods.map((m) =>
          m.categoryID === categoryID ? { ...m, categoryID: "" } : m,
        );
        return { ...prev, categories, mods };
      });
    },
    [setWorkingData],
  );
  return remove;
}

export function useUpdateCategory() {
  const { setWorkingData } = useDataEditorContext();
  const update = useCallback(
    (index: number, updates: Partial<ModCategory>) => {
      setWorkingData((prev) => {
        const categories = [...prev.categories];
        categories[index] = { ...categories[index], ...updates } as ModCategory;
        return { ...prev, categories };
      });
    },
    [setWorkingData],
  );
  return update;
}

export function useCreateMod() {
  const { setWorkingData } = useDataEditorContext();
  const create = useCallback(
    (categoryID?: string): Mod => {
      let created: Mod | null = null;
      setWorkingData((prev) => {
        const id = nextNewModID(prev.mods);
        const number = id.split("_").pop();
        created = {
          id,
          categoryID: categoryID || "",
          name: `New Mod ${number}`,
          version: "0.0.1",
        };
        return { ...prev, mods: [...prev.mods, created!] };
      });
      return created!;
    },
    [setWorkingData],
  );
  return create;
}

export function useDeleteMod() {
  const { setWorkingData } = useDataEditorContext();
  const remove = useCallback(
    (modID: string) => {
      setWorkingData((prev) => {
        const mods = prev.mods.filter((m) => m.id !== modID);
        const files = prev.files.map((f) => ({
          ...f,
          modID: f.modID === modID ? "" : f.modID,
        }));
        return { ...prev, mods, files };
      });
    },
    [setWorkingData],
  );
  return remove;
}

export function useUpdateMod() {
  const { setWorkingData } = useDataEditorContext();
  const update = useCallback(
    (modID: string, updates: Partial<Mod>) => {
      setWorkingData((prev) => {
        const mods = prev.mods.map((m) =>
          m.id === modID ? { ...m, ...updates } : m,
        ) as Mod[];
        return { ...prev, mods };
      });
    },
    [setWorkingData],
  );
  return update;
}

export function useCreateFile() {
  const { setWorkingData } = useDataEditorContext();
  const create = useCallback(
    (modID?: string): ModFile => {
      let created: ModFile | null = null;
      setWorkingData((prev) => {
        const name = nextNewFileName(prev.files);
        created = { name, modID: modID || "" };
        return { ...prev, files: [...prev.files, created!] };
      });
      return created!;
    },
    [setWorkingData],
  );
  return create;
}

export function useDeleteFile() {
  const { setWorkingData } = useDataEditorContext();
  const remove = useCallback(
    (fileName: string) => {
      setWorkingData((prev) => ({
        ...prev,
        files: prev.files.filter((f) => f.name !== fileName),
      }));
    },
    [setWorkingData],
  );
  return remove;
}

export function useUpdateFile() {
  const { setWorkingData } = useDataEditorContext();
  const update = useCallback(
    (fileName: string, updates: Partial<ModFile>) => {
      setWorkingData((prev) => {
        const files = prev.files.map((f) =>
          f.name === fileName ? { ...f, ...updates } : f,
        ) as ModFile[];
        return { ...prev, files };
      });
    },
    [setWorkingData],
  );
  return update;
}
// 返回由 DataEditorRoot 集中创建的派生原子对象（一次性、每 Provider 实例）
export function useDataEditorAtoms(): DerivedAtoms {
  const { derivedAtoms } = useDataEditorContext();
  return derivedAtoms as DerivedAtoms;
}
