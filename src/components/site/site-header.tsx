"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
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
import { mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ROLE_HOME, usePreviewRole, type PreviewRole } from "@/components/preview-role";

const PROFILES: Record<Exclude<PreviewRole, "guest">, string> = {
  customer: "/dashboard/profile",
  owner: "/owner/profile",
  admin: "/admin/profile",
};

const PEOPLE: Record<Exclude<PreviewRole, "guest">, { name: string; initials: string; meta: string }> = {
  customer: { name: "Tanvir Ahmed", initials: "TA", meta: "Customer · Dhanmondi" },
  owner: { name: "Rafiul Islam", initials: "RI", meta: "Owner · 3 listings" },
  admin: { name: "Ayesha Karim", initials: "AK", meta: "Admin · Yardclub" },
};

export function SiteHeader() {
  const pathname = usePathname();
  const { role: previewRole, setRole } = usePreviewRole();
  const [open, setOpen] = useState(false);
  const routeRole: PreviewRole | null = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/owner")
      ? "owner"
      : pathname.startsWith("/dashboard")
        ? "customer"
        : null;
  const role = routeRole ?? previewRole;
  const guest = role === "guest";
  const person = guest ? null : PEOPLE[role];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-background/92 backdrop-blur-md">
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

          {guest ? (
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
              <Button
                asChild
                variant="ghost"
                className="hidden h-11 rounded-md px-3 font-semibold md:inline-flex"
              >
                <Link href={ROLE_HOME[role]}>Dashboard</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="grid size-11 place-items-center rounded-full border-2 border-ink bg-lime font-mono text-xs font-bold text-primary-foreground shadow-offset-sm transition-transform hover:-translate-y-0.5"
                    aria-label={`Account menu for ${person?.name}`}
                  >
                    {person?.initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-60 rounded-lg border-2 border-ink shadow-offset-sm"
                >
                  <DropdownMenuLabel className="flex items-center gap-2 py-2">
                    <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-secondary font-mono text-[11px] font-bold">
                      {person?.initials}
                    </span>
                    <span className="grid">
                      <span className="text-sm font-semibold">{person?.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                        {person?.meta}
                      </span>
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer font-medium">
                    <Link href={ROLE_HOME[role]}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer font-medium">
                    <Link href={PROFILES[role as Exclude<PreviewRole, "guest">]}>
                      My profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer font-medium text-destructive focus:text-destructive"
                    onSelect={() => setRole("guest")}
                  >
                    Sign out
                  </DropdownMenuItem>
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
                {guest ? (
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
                ) : (
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
                        <Link href={PROFILES[role as Exclude<PreviewRole, "guest">]}>
                          My profile
                        </Link>
                      </Button>
                    </SheetClose>
                    <Button
                      variant="ghost"
                      className="h-11 justify-start rounded-md font-semibold text-destructive"
                      onClick={() => {
                        setRole("guest");
                        setOpen(false);
                      }}
                    >
                      Sign out
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
