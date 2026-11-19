import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { catalogHref, type CatalogState } from "@/lib/equipment-catalog";
import { cn } from "@/lib/utils";

export function CatalogPagination({
  state,
  total,
  totalPages,
  perPage,
}: {
  state: CatalogState;
  total: number;
  totalPages: number;
  perPage: number;
}) {
  if (totalPages <= 1) return null;

  const from = (state.page - 1) * perPage + 1;
  const to = Math.min(state.page * perPage, total);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const stepClass =
    "inline-flex h-9 items-center gap-1 rounded-[6px] border-2 border-ink px-2.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-col gap-4 border-t-2 border-ink pt-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
        {from}–{to} of {total} · page {state.page}/{totalPages}
      </p>

      <div className="flex items-center gap-1.5">
        {state.page > 1 ? (
          <Link
            href={catalogHref({ ...state, page: state.page - 1 })}
            rel="prev"
            className={cn(stepClass, "bg-surface hover:bg-secondary")}
          >
            <ArrowLeft className="size-3" aria-hidden="true" />
            Prev
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={cn(stepClass, "cursor-not-allowed border-ink/20 text-ink-soft/50")}
          >
            <ArrowLeft className="size-3" aria-hidden="true" />
            Prev
          </span>
        )}

        {pages.map((page) =>
          page === state.page ? (
            <span
              key={page}
              aria-current="page"
              className="inline-flex size-9 items-center justify-center rounded-[6px] border-2 border-ink bg-lime font-mono text-[11px] font-bold text-primary-foreground shadow-offset-sm"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={catalogHref({ ...state, page })}
              aria-label={`Page ${page}`}
              className="inline-flex size-9 items-center justify-center rounded-[6px] border-2 border-ink bg-surface font-mono text-[11px] transition-colors hover:bg-secondary"
            >
              {page}
            </Link>
          ),
        )}

        {state.page < totalPages ? (
          <Link
            href={catalogHref({ ...state, page: state.page + 1 })}
            rel="next"
            className={cn(stepClass, "bg-surface hover:bg-secondary")}
          >
            Next
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={cn(stepClass, "cursor-not-allowed border-ink/20 text-ink-soft/50")}
          >
            Next
            <ArrowRight className="size-3" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
