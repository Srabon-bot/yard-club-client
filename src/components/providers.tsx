"use client";

import { ThemeProvider } from "next-themes";
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
        <TooltipProvider delayDuration={250}>
          {children}
          <Toaster position="top-center" richColors closeButton />
        </TooltipProvider>
      </PreviewRoleProvider>
    </ThemeProvider>
  );
}
