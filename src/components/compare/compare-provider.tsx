"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";
import { useHydrated } from "@/lib/use-hydrated";

const STORAGE_KEY = "yardclub-compare";
const MAX_ITEMS = 3;
const EMPTY: string[] = [];

let cachedRaw: string | null | undefined;
let cachedIds: string[] = EMPTY;
const listeners = new Set<() => void>();

function readIds(): string[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }

  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;

  if (!raw) {
    cachedIds = EMPTY;
    return cachedIds;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    cachedIds = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string").slice(0, MAX_ITEMS)
      : EMPTY;
  } catch {
    cachedIds = EMPTY;
  }

  return cachedIds;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function writeIds(ids: string[]) {
  cachedRaw = JSON.stringify(ids);
  cachedIds = ids;

  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    /* A blocked storage write should not break comparison. */
  }

  listeners.forEach((listener) => listener());
}

type CompareValue = {
  ids: string[];
  ready: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareValue | null>(null);

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used inside CompareProvider");
  return context;
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(subscribe, readIds, getServerSnapshot);
  const ready = useHydrated();

  const toggle = useCallback((id: string) => {
    const current = readIds();
    if (current.includes(id)) {
      writeIds(current.filter((entry) => entry !== id));
      return;
    }
    if (current.length >= MAX_ITEMS) {
      toast.info(`Compare holds ${MAX_ITEMS} items. Remove one first.`);
      return;
    }
    writeIds([...current, id]);
  }, []);

  const remove = useCallback((id: string) => {
    writeIds(readIds().filter((entry) => entry !== id));
  }, []);

  const clear = useCallback(() => writeIds([]), []);

  const value = useMemo(
    () => ({
      ids,
      ready,
      has: (id: string) => ids.includes(id),
      toggle,
      remove,
      clear,
    }),
    [ids, ready, toggle, remove, clear],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}
