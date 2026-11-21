"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/* True only after hydration, so server and first client render match. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
