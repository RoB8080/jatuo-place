import { useLocalStorage } from "@uidotdev/usehooks";
import { useCallback, type Dispatch, type SetStateAction } from "react";

type PersistStateOfVersion = {
  selectedModIDs: string[];
  expandedCategoryIDs: string[];
};

function initPersistStateOfVersion(): PersistStateOfVersion {
  return {
    selectedModIDs: [],
    expandedCategoryIDs: [],
  };
}

/** State to persist, mainly user selection */
type PersistState = {
  versionStateMap: Partial<Record<string, PersistStateOfVersion>>;
  selectedVersionKey: string | undefined;
};

const initialPersistState: PersistState = {
  versionStateMap: {},
  selectedVersionKey: undefined,
};

export interface UsePersistStateResult {
  selectedVersionKey: string | undefined;
  setSelectedVersionKey: (key: string | undefined) => void;
  // by version state
  expandedCategoryIDs: string[] | undefined;
  setExpandedCategoryIDs: Dispatch<SetStateAction<string[]>>;
  selectedModIDs: string[] | undefined;
  setSelectedModIDs: Dispatch<SetStateAction<string[]>>;
}

export function usePersistState() {
  const [{ selectedVersionKey, versionStateMap }, setState] =
    useLocalStorage<PersistState>("map-combo", initialPersistState);

  const setSelectedVersionKey = useCallback<
    Dispatch<SetStateAction<string | undefined>>
  >(
    (valueOrUpdater) => {
      setState((prev) => ({
        ...prev,
        selectedVersionKey:
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(prev.selectedVersionKey)
            : valueOrUpdater,
      }));
    },
    [setState],
  );

  const { selectedModIDs, expandedCategoryIDs } = selectedVersionKey
    ? versionStateMap[selectedVersionKey] || initPersistStateOfVersion()
    : initPersistStateOfVersion();

  const setSelectedModIDs = useCallback<Dispatch<SetStateAction<string[]>>>(
    (valueOrUpdater) => {
      setState((prev) => {
        const actualSelectedKey = prev.selectedVersionKey || "";
        const prevState =
          prev.versionStateMap[actualSelectedKey] ||
          initPersistStateOfVersion();
        const modIDs =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(prevState.selectedModIDs)
            : valueOrUpdater;
        return {
          ...prev,
          versionStateMap: {
            ...prev.versionStateMap,
            [actualSelectedKey]: {
              ...prevState,
              selectedModIDs: modIDs,
            },
          },
        };
      });
    },
    [setState],
  );

  const setExpandedCategoryIDs = useCallback<
    Dispatch<SetStateAction<string[]>>
  >(
    (valueOrUpdater) => {
      setState((prev) => {
        const actualSelectedKey = prev.selectedVersionKey || "";
        const prevState =
          prev.versionStateMap[actualSelectedKey] ||
          initPersistStateOfVersion();
        const categoryIDs =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(prevState.expandedCategoryIDs)
            : valueOrUpdater;
        return {
          ...prev,
          versionStateMap: {
            ...prev.versionStateMap,
            [actualSelectedKey]: {
              ...prevState,
              expandedCategoryIDs: categoryIDs,
            },
          },
        };
      });
    },
    [setState],
  );

  return {
    selectedVersionKey,
    setSelectedVersionKey,
    selectedModIDs,
    setSelectedModIDs,
    expandedCategoryIDs,
    setExpandedCategoryIDs,
  };
}
