import { get, set } from "idb-keyval";
import { useCallback, useEffect, useRef, useState } from "react";
import pDebounce from "p-debounce";

// 全局内存缓存，用于乐观更新
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryCache = new Map<string, any>();

// 为每个 key 创建独立的 debounced 写入函数
const debouncedWriteMap = new Map<string, ReturnType<typeof pDebounce>>();

function getDebouncedWrite(key: string) {
  if (!debouncedWriteMap.has(key)) {
    const debouncedFn = pDebounce(async (value) => {
      try {
        await set(key, value);
      } catch (error) {
        console.error(`Failed to persist data for key "${key}":`, error);
      }
    }, 300);
    debouncedWriteMap.set(key, debouncedFn);
  }
  return debouncedWriteMap.get(key)!;
}

/**
 * 基于 idb-keyval 的持久化状态 Hook
 *
 * 特性：
 * - 乐观更新：状态变更立即反映在 UI 上
 * - 内存缓存：避免重复从 IDB 读取
 * - Debounce 写入：减少 IDB 写入频率
 * - 错误容错：IDB 操作失败不影响 UI 状态
 *
 * @param key 存储键名
 * @param defaultValue 默认值
 * @returns [state, setState] 类似 useState 的 API
 */
export function usePersistState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    // 优先从内存缓存读取
    return memoryCache.has(key) ? memoryCache.get(key) : defaultValue;
  });

  const isInitialized = useRef(false);

  // 初始化时从 IDB 加载数据
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // 如果内存中已有数据，说明其他组件已经初始化过了
    if (memoryCache.has(key)) {
      setState(memoryCache.get(key));
      return;
    }

    // 从 IDB 加载
    get(key)
      .then((value) => {
        const finalValue = value !== undefined ? value : defaultValue;
        memoryCache.set(key, finalValue);
        setState(finalValue);
      })
      .catch(() => {
        // IDB 读取失败，使用默认值
        memoryCache.set(key, defaultValue);
        setState(defaultValue);
      });
  }, [key, defaultValue]);

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      const newValue =
        typeof valueOrUpdater === "function"
          ? (valueOrUpdater as (prev: T) => T)(state)
          : valueOrUpdater;

      // 乐观更新：立即更新内存和 React 状态
      memoryCache.set(key, newValue);
      setState(newValue);

      // Debounced 写入 IDB
      getDebouncedWrite(key)(newValue);
    },
    [key, state],
  );

  return [state, setValue];
}
