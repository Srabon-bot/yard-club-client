import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/format";
import type { Equipment } from "@/lib/types";

export function MobileBookingBar({ item }: { item: Equipment }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-surface px-4 py-3 print:hidden lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{item.name}</p>
          <p className="font-mono text-xs tabular-nums">
            {formatBDT(item.pricePerDay)}
            <span className="text-[10px] text-ink-soft"> /day</span>
          </p>
        </div>
        <Button asChild className="h-11 shrink-0">
          <Link href="#book-mobile">
            <CalendarDays className="size-4" aria-hidden="true" />
            Pick dates
          </Link>
        </Button>
      </div>
    </div>
  );
}
