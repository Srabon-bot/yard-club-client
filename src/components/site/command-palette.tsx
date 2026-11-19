"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Calendar,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  Layers,
  LayoutDashboard,
  Search,
  Settings,
  Truck,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { equipment } from "@/lib/mock/equipment";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search equipment..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/"))}
            >
              <Home className="mr-2 size-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/equipment"))}
            >
              <Layers className="mr-2 size-4" />
              <span>All Equipment Catalogue</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/how-it-works"))}
            >
              <Truck className="mr-2 size-4" />
              <span>How It Works</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/about"))}
            >
              <FileText className="mr-2 size-4" />
              <span>About Yardclub</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/faq"))}
            >
              <HelpCircle className="mr-2 size-4" />
              <span>FAQ & Support</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/contact"))}
            >
              <User className="mr-2 size-4" />
              <span>Contact Us</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Equipment Quick Jump">
            {equipment.slice(0, 8).map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() =>
                  runCommand(() => router.push(`/equipment/${item.id}`))
                }
              >
                <Search className="mr-2 size-4 text-lime" />
                <span>{item.name}</span>
                <span className="ml-auto font-mono text-[10px] text-ink-soft">
                  {item.location}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Dashboards">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <LayoutDashboard className="mr-2 size-4" />
              <span>Customer Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/owner"))}
            >
              <LayoutDashboard className="mr-2 size-4" />
              <span>Owner Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/admin"))}
            >
              <Settings className="mr-2 size-4" />
              <span>Admin Dashboard</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
