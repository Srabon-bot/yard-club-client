"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesColumn,
  Heart,
  LayoutGrid,
  Package,
  Plus,
  UserRound,
  UsersRound,
} from "lucide-react";
import { dashboardNav, type DashboardRole } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

const ICONS = {
  grid: LayoutGrid,
  box: Package,
  heart: Heart,
  user: UserRound,
  users: UsersRound,
  calendar: CalendarDays,
  plus: Plus,
  chart: ChartNoAxesColumn,
} as const;

const PERSONAS: Record<
  DashboardRole,
  { name: string; initials: string; label: string; email: string }
> = {
  customer: {
    name: "Tanvir Ahmed",
    initials: "TA",
    label: "Customer workspace",
    email: "tanvir.ahmed@example.com",
  },
  owner: {
    name: "Rafiul Islam",
    initials: "RI",
    label: "Owner workspace",
    email: "rafiul.islam@example.com",
  },
  admin: {
    name: "Ayesha Karim",
    initials: "AK",
    label: "Admin workspace",
    email: "ayesha.karim@yardclub.com",
  },
};

function roleFromPath(pathname: string): DashboardRole {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/owner")) return "owner";
  return "customer";
}

function isDashboardRole(value: unknown): value is DashboardRole {
  return value === "customer" || value === "owner" || value === "admin";
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "YC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const ROOTS: Record<DashboardRole, string> = {
  customer: "/dashboard",
  owner: "/owner",
  admin: "/admin",
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const liveUser = session?.user as
    | {
        name?: string | null;
        email?: string | null;
        role?: string | null;
      }
    | undefined;
  const sessionRole = isDashboardRole(liveUser?.role) ? liveUser.role : null;
  const routeRole = roleFromPath(pathname);
  const role = sessionRole ?? routeRole;
  const fallbackPersona = PERSONAS[role];

  const persona =
    liveUser && sessionRole
      ? {
          name: liveUser.name || "Yardclub user",
          initials: initialsFor(liveUser.name || "Yardclub user"),
          label: fallbackPersona.label,
          email: liveUser.email || "",
        }
      : fallbackPersona;

  const links = dashboardNav[role];
  const root = ROOTS[role];

  const isActive = (href: string) =>
    href === root ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="container-page py-6 lg:py-10">
      <div className="grid gap-5 lg:grid-cols-[236px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <aside className="lg:sticky lg:top-[92px]">
          <div className="hidden rounded-[10px] border-2 border-ink bg-surface p-3 shadow-offset-sm lg:block">
            <div className="flex items-center gap-2.5 px-1.5 pb-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[8px] border-2 border-ink bg-lime font-mono text-xs font-bold text-primary-foreground">
                {persona.initials}
              </span>
              <span className="grid min-w-0">
                <span className="truncate text-sm font-semibold leading-tight">
                  {persona.name}
                </span>
                <span className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                  {persona.label}
                </span>
              </span>
            </div>

            <nav aria-label={`${persona.label} navigation`} className="grid gap-0.5">
              {links.map((link) => {
                const Icon = ICONS[link.icon];
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-[13px] font-semibold transition-colors",
                      active
                        ? "bg-ink text-background"
                        : "text-ink-soft hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 border-t-2 border-ink pt-3">
              <p className="flex items-start gap-2 px-1.5 font-mono text-[9px] leading-relaxed uppercase tracking-[0.1em] text-ink-soft">
                <i className="mt-1 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
                Equipment is live. Bookings are sample data.
              </p>
            </div>
          </div>

          <nav
            aria-label={`${persona.label} navigation`}
            className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {links.map((link) => {
              const Icon = ICONS[link.icon];
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border-2 border-ink px-3 text-xs font-semibold",
                    active ? "bg-ink text-background" : "bg-surface text-ink",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
