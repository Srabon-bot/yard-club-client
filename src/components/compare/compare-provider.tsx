"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

const STORAGE_KEY = "yardclub-compare";
const MAX_ITEMS = 3;

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
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((id): id is string => typeof id === "string").slice(0, MAX_ITEMS));
        }
      }
    } catch {
      /* A broken value should not block the page. */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, ready]);

  const toggle = useCallback(
    (id: string) => {
      setIds((current) => {
        if (current.includes(id)) {
          return current.filter((entry) => entry !== id);
        }
        if (current.length >= MAX_ITEMS) {
          toast.info(`Compare holds ${MAX_ITEMS} items. Remove one first.`);
          return current;
        }
        return [...current, id];
      });
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setIds((current) => current.filter((entry) => entry !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

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
