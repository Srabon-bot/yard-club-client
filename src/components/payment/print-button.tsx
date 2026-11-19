"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => window.print()}
      className="h-11 border-2 border-ink"
    >
      <Printer className="size-4" aria-hidden="true" />
      Print receipt
    </Button>
  );
}
