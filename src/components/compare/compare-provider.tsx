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
const EMPTY: CompareItem[] = [];

export type CompareItem = {
  id: string;
  name: string;
  location: string;
  image: string;
};

let cachedRaw: string | null | undefined;
let cachedItems: CompareItem[] = EMPTY;
const listeners = new Set<() => void>();

function isCompareItem(value: unknown): value is CompareItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.location === "string" &&
    typeof item.image === "string"
  );
}

function readItems(): CompareItem[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }

  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;

  if (!raw) {
    cachedItems = EMPTY;
    return cachedItems;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    cachedItems = Array.isArray(parsed)
      ? parsed.filter(isCompareItem).slice(0, MAX_ITEMS)
      : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }

  return cachedItems;
}

function getServerSnapshot(): CompareItem[] {
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

function writeItems(items: CompareItem[]) {
  cachedRaw = JSON.stringify(items);
  cachedItems = items;

  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    /* A blocked storage write should not break comparison. */
  }

  listeners.forEach((listener) => listener());
}

type CompareValue = {
  items: CompareItem[];
  ids: string[];
  ready: boolean;
  has: (id: string) => boolean;
  toggle: (item: CompareItem) => void;
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
  const items = useSyncExternalStore(subscribe, readItems, getServerSnapshot);
  const ready = useHydrated();

  const toggle = useCallback((item: CompareItem) => {
    const current = readItems();
    if (current.some((entry) => entry.id === item.id)) {
      writeItems(current.filter((entry) => entry.id !== item.id));
      return;
    }
    if (current.length >= MAX_ITEMS) {
      toast.info(`Compare holds ${MAX_ITEMS} items. Remove one first.`);
      return;
    }
    writeItems([...current, item]);
  }, []);

  const remove = useCallback((id: string) => {
    writeItems(readItems().filter((entry) => entry.id !== id));
  }, []);

  const clear = useCallback(() => writeItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ids: items.map((item) => item.id),
      ready,
      has: (id: string) => items.some((item) => item.id === id),
      toggle,
      remove,
      clear,
    }),
    [items, ready, toggle, remove, clear],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}
