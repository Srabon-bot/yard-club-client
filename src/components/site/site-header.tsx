"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { mainNav, type DashboardRole } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

const ROLE_HOME: Record<DashboardRole, string> = {
  customer: "/dashboard",
  owner: "/owner",
  admin: "/admin",
};

const PROFILES: Record<DashboardRole, string> = {
  customer: "/dashboard/profile",
  owner: "/owner/profile",
  admin: "/admin/profile",
};

function isDashboardRole(value: unknown): value is DashboardRole {
  return value === "customer" || value === "owner" || value === "admin";
}

function getInitials(name?: string): string {
  if (!name) return "—";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);

  const liveUser = session?.user as
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
      }
    | undefined;

  const authenticated = Boolean(session?.user);
  const showAccount = authenticated || isPending;
  const sessionRole = isDashboardRole(liveUser?.role) ? liveUser.role : null;
  const role: DashboardRole =
    sessionRole ??
    (pathname.startsWith("/admin")
      ? "admin"
      : pathname.startsWith("/owner")
        ? "owner"
        : "customer");

  // Live session data only. While it loads, the account stays neutral.
  const name = liveUser?.name?.trim() || "Account";
  const initials = liveUser?.name?.trim() ? getInitials(liveUser.name) : "—";
  const subtitle = liveUser?.email || "";
  const roleLabel = sessionRole ? sessionRole.toUpperCase() : "ACCOUNT";
  const image = liveUser?.image || null;

  const handleSignOut = async () => {
    if (!session) return;
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch {
      toast.error("Error signing out");
      return;
    }
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 border-b-2 border-ink bg-background/92 backdrop-blur-md"
    >
      <div className="container-page flex h-[72px] items-center gap-3">
        <Logo />

        <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-[3px] after:bg-lime"
                    : "text-ink-soft hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-11 rounded-md text-ink hover:bg-secondary"
          >
            <Link href="/equipment" aria-label="Search equipment">
              <Search className="size-[18px]" />
            </Link>
          </Button>

          <ThemeToggle />

          {!showAccount ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden h-11 rounded-md px-3 font-semibold sm:inline-flex"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="hidden h-11 rounded-md border-2 border-ink bg-lime px-4 font-semibold text-primary-foreground shadow-offset-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime-hover hover:shadow-[4px_4px_0_var(--ink)] sm:inline-flex"
              >
                <Link href="/register">List your gear</Link>
              </Button>
            </>
          ) : (
            <>
              {authenticated && (
                <Button
                  asChild
                  variant="ghost"
                  className="hidden h-11 rounded-md px-3 font-semibold md:inline-flex"
                >
                  <Link href={ROLE_HOME[role]}>Dashboard</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative grid size-11 place-items-center overflow-hidden rounded-full border-2 border-ink bg-lime font-mono text-xs font-bold text-primary-foreground shadow-offset-sm transition-transform hover:-translate-y-0.5"
                    aria-label={
                      authenticated ? `Account menu for ${name}` : "Account menu"
                    }
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      initials
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-72 rounded-lg border-2 border-ink p-1.5 shadow-offset-sm"
                >
                  <DropdownMenuLabel className="flex items-start gap-3 p-2.5">
                    <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-ink bg-secondary font-mono text-xs font-bold">
                      {image ? (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        initials
                      )}
                    </span>
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="truncate text-sm font-bold leading-tight text-foreground">
                        {name}
                      </span>
                      <span className="inline-flex w-fit items-center rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {roleLabel}
                      </span>
                      {subtitle && (
                        <span
                          title={subtitle}
                          className="truncate font-mono text-xs text-muted-foreground"
                        >
                          {subtitle}
                        </span>
                      )}
                      {isPending && (
                        <span className="font-mono text-[10px] text-ink-soft">
                          Checking account…
                        </span>
                      )}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {authenticated ? (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer font-medium">
                        <Link href={ROLE_HOME[role]}>Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer font-medium">
                        <Link href={PROFILES[role]}>My profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer font-medium text-destructive focus:text-destructive"
                        onSelect={handleSignOut}
                      >
                        Sign out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <p className="px-2 py-2 text-xs text-ink-soft">
                      Checking your account…
                    </p>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-11 rounded-md text-ink hover:bg-secondary lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(88vw,360px)] border-l-2 border-ink bg-background p-0"
            >
              <SheetHeader className="border-b-2 border-ink px-5 py-4">
                <SheetTitle className="text-left font-heading text-2xl font-extrabold tracking-[-0.04em]">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-3">
                {mainNav.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-md px-3 py-3 text-lg font-semibold hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/faq"
                    className="rounded-md px-3 py-3 text-lg font-semibold hover:bg-secondary"
                  >
                    FAQ
                  </Link>
                </SheetClose>
              </div>
              <div className="mt-auto grid gap-2 border-t-2 border-ink p-5">
                {!showAccount ? (
                  <>
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-md border-2 border-ink font-semibold"
                      >
                        <Link href="/login">Log in</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="h-11 rounded-md border-2 border-ink bg-lime font-semibold text-primary-foreground shadow-offset-sm"
                      >
                        <Link href="/register">List your gear</Link>
                      </Button>
                    </SheetClose>
                  </>
                ) : authenticated ? (
                  <>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="h-11 rounded-md border-2 border-ink bg-lime font-semibold text-primary-foreground shadow-offset-sm"
                      >
                        <Link href={ROLE_HOME[role]}>Dashboard</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="h-11 rounded-md border-2 border-ink font-semibold"
                      >
                        <Link href={PROFILES[role]}>My profile</Link>
                      </Button>
                    </SheetClose>
                    <Button
                      variant="ghost"
                      className="h-11 justify-start rounded-md font-semibold text-destructive"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <p className="px-3 py-2 text-sm text-ink-soft">
                    Checking your account…
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
