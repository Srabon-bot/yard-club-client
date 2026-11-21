"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type PreviewRole = "guest" | "customer" | "owner" | "admin";

export const ROLE_HOME: Record<PreviewRole, string> = {
  guest: "/",
  customer: "/dashboard",
  owner: "/owner",
  admin: "/admin",
};

const STORAGE_KEY = "yardclub-preview-role";
const ROLES: PreviewRole[] = ["guest", "customer", "owner", "admin"];
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const listeners = new Set<() => void>();

function isPreviewRole(value: string | null): value is PreviewRole {
  return value !== null && (ROLES as string[]).includes(value);
}

function getSnapshot(): PreviewRole {
  if (!IS_DEVELOPMENT) return "guest";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isPreviewRole(saved) ? saved : "guest";
}

function getServerSnapshot(): PreviewRole {
  return "guest";
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

function writeRole(role: PreviewRole) {
  window.localStorage.setItem(STORAGE_KEY, role);
  listeners.forEach((listener) => listener());
}

type PreviewRoleValue = {
  role: PreviewRole;
  setRole: (role: PreviewRole) => void;
};

const PreviewRoleContext = createContext<PreviewRoleValue | null>(null);

export function usePreviewRole() {
  const ctx = useContext(PreviewRoleContext);
  if (!ctx) throw new Error("usePreviewRole must be used inside PreviewRoleProvider");
  return ctx;
}

export function PreviewRoleProvider({ children }: { children: React.ReactNode }) {
  const role = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();

  const setRole = useCallback(
    (next: PreviewRole) => {
      if (!IS_DEVELOPMENT) return;
      writeRole(next);
      router.push(ROLE_HOME[next]);
    },
    [router],
  );

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return (
    <PreviewRoleContext.Provider value={value}>
      {children}
      <PreviewRoleBar role={role} onChange={setRole} />
    </PreviewRoleContext.Provider>
  );
}

/* Design-phase helper: flips the header and dashboard between the four auth
   states so every screen can be audited without a backend. Development only. */
function PreviewRoleBar({
  role,
  onChange,
}: {
  role: PreviewRole;
  onChange: (role: PreviewRole) => void;
}) {
  if (!IS_DEVELOPMENT) return null;

  return (
    <div
      data-preview-ui
      className="fixed bottom-4 left-4 z-[70] hidden items-center gap-1 rounded-full border-2 border-ink bg-surface p-1 shadow-offset-sm md:flex print:hidden"
      aria-label="Preview role"
    >
      <span className="eyebrow px-2 text-[10px]">Preview</span>
      {ROLES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          aria-pressed={role === r}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] transition-colors",
            role === r
              ? "bg-ink text-background"
              : "text-ink-soft hover:bg-secondary hover:text-foreground",
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
