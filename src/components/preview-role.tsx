"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  const [role, setRoleState] = useState<PreviewRole>("guest");
  const router = useRouter();

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (ROLES as string[]).includes(saved)) {
      setRoleState(saved as PreviewRole);
    }
  }, []);

  const setRole = useCallback(
    (next: PreviewRole) => {
      setRoleState(next);
      window.localStorage.setItem(STORAGE_KEY, next);
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
   states so every screen can be audited without a backend. Hidden in
   production and in print. */
function PreviewRoleBar({
  role,
  onChange,
}: {
  role: PreviewRole;
  onChange: (role: PreviewRole) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).has("preview");
    setVisible(process.env.NODE_ENV === "development" || forced);
  }, []);

  if (!visible) return null;

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
