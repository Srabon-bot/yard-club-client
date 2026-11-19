"use client";

import { ThemeProvider } from "next-themes";
import { CompareProvider } from "@/components/compare/compare-provider";
import { CompareTray } from "@/components/compare/compare-tray";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PreviewRoleProvider } from "@/components/preview-role";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-mode"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PreviewRoleProvider>
        <CompareProvider>
          <TooltipProvider delayDuration={250}>
            {children}
            <Toaster position="top-center" richColors closeButton />
            <CompareTray />
          </TooltipProvider>
        </CompareProvider>
      </PreviewRoleProvider>
    </ThemeProvider>
  );
}
