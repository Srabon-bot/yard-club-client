"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useCompare } from "@/components/compare/compare-provider";
import { equipment } from "@/lib/mock/equipment";

export function CompareTray() {
  const { ids, ready, remove, clear } = useCompare();

  if (!ready || ids.length === 0) return null;

  const items = ids
    .map((id) => equipment.find((item) => item.id === id))
    .filter((item): item is (typeof equipment)[number] => Boolean(item));

  if (items.length === 0) return null;

  return (
    <aside
      aria-label="Compare tray"
      className="fixed bottom-20 right-4 z-[60] w-[min(92vw,400px)] rounded-[10px] border-2 border-ink bg-surface shadow-offset print:hidden lg:bottom-6 lg:right-6"
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-3.5 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em]">
          Compare · {items.length}/3
        </p>
        <button
          type="button"
          onClick={clear}
          className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:text-foreground hover:decoration-ink"
        >
          Clear
        </button>
      </div>

      <div className="grid gap-2 p-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-[4px] border-2 border-ink bg-secondary">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold">
                {item.name}
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                {item.location}
              </span>
            </span>
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Remove ${item.name} from compare`}
              className="grid size-7 shrink-0 place-items-center rounded-full border border-ink/20 text-ink-soft transition-colors hover:border-ink hover:bg-secondary hover:text-foreground"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-ink p-3">
        <Link
          href={`/compare?ids=${items.map((item) => item.id).join(",")}`}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[6px] border-2 border-ink bg-lime font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-primary-foreground shadow-offset-sm transition-transform hover:-translate-y-0.5"
        >
          Compare side by side
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
