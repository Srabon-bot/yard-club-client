"use client";

import { GitCompareArrows } from "lucide-react";
import { useCompare } from "@/components/compare/compare-provider";
import { cn } from "@/lib/utils";

export function CompareToggle({
  id,
  name,
  className,
  withLabel = false,
}: {
  id: string;
  name: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { has, toggle, ready } = useCompare();
  const active = ready && has(id);

  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from compare` : `Add ${name} to compare`}
      title={active ? "Remove from compare" : "Add to compare"}
      className={cn(
        "inline-flex items-center justify-center gap-2 border-2 border-ink font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
        withLabel
          ? "h-10 rounded-[6px] px-3"
          : "size-8 rounded-full backdrop-blur-sm",
        active
          ? "bg-lime text-primary-foreground"
          : "bg-background/90 text-ink hover:bg-lime-soft",
        className,
      )}
    >
      <GitCompareArrows className="size-3.5" aria-hidden="true" />
      {withLabel && <span>{active ? "In compare" : "Compare"}</span>}
    </button>
  );
}
