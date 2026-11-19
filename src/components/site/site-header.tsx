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
import { mainNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ROLE_HOME, usePreviewRole, type PreviewRole } from "@/components/preview-role";
import { useSession, signOut } from "@/lib/auth-client";

const PROFILES: Record<Exclude<PreviewRole, "guest">, string> = {
  customer: "/dashboard/profile",
  owner: "/owner/profile",
  admin: "/admin/profile",
};

const PEOPLE: Record<
  Exclude<PreviewRole, "guest">,
  { name: string; initials: string; roleLabel: string; subtitle: string; image?: string | null }
> = {
  customer: {
    name: "Tanvir Ahmed",
    initials: "TA",
    roleLabel: "Customer",
    subtitle: "Dhanmondi, Dhaka",
    image: null,
  },
  owner: {
    name: "Rafiul Islam",
    initials: "RI",
    roleLabel: "Owner",
    subtitle: "3 active listings",
    image: null,
  },
  admin: {
    name: "Ayesha Karim",
    initials: "AK",
    roleLabel: "Admin",
    subtitle: "Yardclub Platform",
    image: null,
  },
};

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { role: previewRole, setRole } = usePreviewRole();
  const [open, setOpen] = useState(false);

  // If live session exists, prioritize live session user
  const liveUser = session?.user as
    | {
        id?: string;
        name?: string;
        email?: string;
        image?: string | null;
        role?: string;
      }
    | undefined;

  const sessionRole: PreviewRole | null =
    liveUser?.role === "admin"
      ? "admin"
      : liveUser?.role === "owner"
        ? "owner"
        : liveUser?.role === "customer"
          ? "customer"
          : null;

  const routeRole: PreviewRole | null = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/owner")
      ? "owner"
      : pathname.startsWith("/dashboard")
        ? "customer"
        : null;

  const role: PreviewRole = sessionRole ?? routeRole ?? previewRole;
  const guest = !session && role === "guest";

  const getInitials = (name?: string, fallback = "YC") => {
    if (!name) return fallback;
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const person = guest
    ? null
    : liveUser
      ? {
          name: liveUser.name || "User",
          initials: getInitials(liveUser.name),
          roleLabel: (liveUser.role || "customer").toUpperCase(),
          subtitle: liveUser.email || "",
          image: liveUser.image || null,
        }
      : PEOPLE[role as Exclude<PreviewRole, "guest">];

  const handleSignOut = async () => {
    if (session) {
      try {
        await signOut();
        toast.success("Signed out successfully");
      } catch {
        toast.error("Error signing out");
      }
    }
    setRole("guest");
    setOpen(false);
    router.push("/");
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
                    className="relative grid size-11 place-items-center overflow-hidden rounded-full border-2 border-ink bg-lime font-mono text-xs font-bold text-primary-foreground shadow-offset-sm transition-transform hover:-translate-y-0.5"
                    aria-label={`Account menu for ${person?.name}`}
                  >
                    {person?.image ? (
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      person?.initials
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
                      {person?.image ? (
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        person?.initials
                      )}
                    </span>
                    <span className="grid min-w-0 flex-1 gap-0.5">
                      <span className="truncate text-sm font-bold leading-tight text-foreground">
                        {person?.name}
                      </span>
                      <span className="inline-flex w-fit items-center rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {person?.roleLabel}
                      </span>
                      <span
                        title={person?.subtitle}
                        className="truncate font-mono text-xs text-muted-foreground"
                      >
                        {person?.subtitle}
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
                    onSelect={handleSignOut}
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
                      onClick={handleSignOut}
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
