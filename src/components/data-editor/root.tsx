import {
  type MapComboData,
  type ModCategory,
  type Mod,
  type ModFile,
} from "@/libs/map-combo";
import {
  createContext,
  useContext,
  useMemo,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from "react";
import { atom, useAtom, type PrimitiveAtom, type Atom } from "jotai";
import { atomFamily } from "jotai/utils";

const WORKING_DATA_KEY = "data-editor__working-data";
const defaultWorkingData: MapComboData = {
  categories: [],
  mods: [],
  files: [],
};

function getInitialWorkingData(): MapComboData {
  const data = localStorage.getItem(WORKING_DATA_KEY);
  if (!data) return defaultWorkingData;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.debug("invalid working data", e);
    localStorage.removeItem(WORKING_DATA_KEY);
    return defaultWorkingData;
  }
}

// 全局数据不再使用 TanStack Form；仅保留 workingData 原子与写入。

export interface DerivedAtoms {
  categoriesAtom: Atom<ModCategory[]>;
  modsAtom: Atom<Mod[]>;
  filesAtom: Atom<ModFile[]>;
  modsByCategoryFamily: (categoryID: string) => Atom<Mod[]>;
  filesByModFamily: (modID: string) => Atom<ModFile[]>;
  nomadModsAtom: Atom<Mod[]>;
  nomadFilesAtom: Atom<ModFile[]>;
}

export interface DataEditorContextValue {
  workingDataAtom: PrimitiveAtom<MapComboData>;
  workingData: MapComboData;
  setWorkingData: Dispatch<SetStateAction<MapComboData>>;
  derivedAtoms: DerivedAtoms;
}

const DataEditorContext = createContext<DataEditorContextValue | null>(null);

function useWorkingDataAtom() {
  return useMemo(() => {
    const primitive = atom(getInitialWorkingData());
    return atom(
      (get) => get(primitive),
      (get, set, action: SetStateAction<MapComboData>) => {
        // change value
        set(primitive, action);
        // sync to local storage
        localStorage.setItem(WORKING_DATA_KEY, JSON.stringify(get(primitive)));
      },
    );
  }, []);
}

export function DataEditorRoot(props: { children: ReactNode }): ReactElement {
  const { children } = props;
  const workingDataAtom = useWorkingDataAtom();
  const [workingData, setWorkingData] = useAtom(workingDataAtom);

  const derivedAtoms: DerivedAtoms = useMemo(() => {
    const categoriesAtom: Atom<ModCategory[]> = atom(
      (get) => get(workingDataAtom).categories,
    );
    const modsAtom: Atom<Mod[]> = atom((get) => get(workingDataAtom).mods);
    const filesAtom: Atom<ModFile[]> = atom(
      (get) => get(workingDataAtom).files,
    );

    const modsByCategoryFamily: (categoryID: string) => Atom<Mod[]> =
      atomFamily((categoryID: string) =>
        atom((get) =>
          get(workingDataAtom).mods.filter((m) => m.categoryID === categoryID),
        ),
      );

    const filesByModFamily: (modID: string) => Atom<ModFile[]> = atomFamily(
      (modID: string) =>
        atom((get) =>
          get(workingDataAtom).files.filter((f) => f.modID === modID),
        ),
    );

    const nomadModsAtom: Atom<Mod[]> = atom((get) =>
      get(workingDataAtom).mods.filter((m) => !m.categoryID),
    );
    const nomadFilesAtom: Atom<ModFile[]> = atom((get) =>
      get(workingDataAtom).files.filter((f) => !f.modID),
    );

    return {
      categoriesAtom,
      modsAtom,
      filesAtom,
      modsByCategoryFamily,
      filesByModFamily,
      nomadModsAtom,
      nomadFilesAtom,
    };
  }, [workingDataAtom]);

  return (
    <DataEditorContext.Provider
      value={{ workingDataAtom, workingData, setWorkingData, derivedAtoms }}
    >
      {children}
    </DataEditorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataEditorContext(): DataEditorContextValue {
  const context = useContext(DataEditorContext);
  if (context === null) {
    throw new Error(
      "useDataEditorContext must be used within a DataEditorProvider",
    );
  }
  return context;
}
