import { debounce } from "es-toolkit";
import { useEffect, useMemo } from "react";

export function useDebouncedCallback(
  callback: () => void,
  delay: number,
  {
    edges = [],
  }: {
    edges?: ("leading" | "trailing")[];
  },
) {
  const debouncedCallback = useMemo(() => {
    const debounced = debounce(callback, delay, { edges });
    return debounced;
  }, [callback, delay, edges]);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}
