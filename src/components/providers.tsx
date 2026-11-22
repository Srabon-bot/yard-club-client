"use client";

import { ThemeProvider } from "next-themes";
import { CompareProvider } from "@/components/compare/compare-provider";
import { CompareTray } from "@/components/compare/compare-tray";
import { CommandPalette } from "@/components/site/command-palette";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-mode"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <CompareProvider>
        <TooltipProvider delayDuration={250}>
          {children}
          <Toaster position="top-center" richColors closeButton />
          <CompareTray />
          <CommandPalette />
        </TooltipProvider>
      </CompareProvider>
    </ThemeProvider>
  );
}
