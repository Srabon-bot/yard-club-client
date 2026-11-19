import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { StatusBadge, type StatusTone } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import type {
  BookingStatus,
  EquipmentStatus,
  PaymentStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function DashboardHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b-2 border-ink pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-2 mt-2 max-w-[20ch]">{title}</h1>
        {description && (
          <p className="mt-2.5 max-w-[64ch] text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  accent = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  icon: LucideIcon;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[10px] border-2 border-ink p-4",
        accent ? "bg-lime text-[#060605]" : "bg-surface shadow-offset-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "font-mono text-[9px] uppercase tracking-[0.12em]",
            accent ? "text-black/60" : "text-ink-soft",
          )}
        >
          {label}
        </p>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-[6px] border-2",
            accent
              ? "border-[#060605] bg-[#060605] text-lime"
              : "border-ink bg-secondary text-ink",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 font-mono text-[clamp(1.35rem,2.4vw,1.75rem)] font-medium leading-none tabular-nums">
        {value}
      </p>
      {note && (
        <p
          className={cn(
            "mt-2 text-[11px] leading-snug",
            accent ? "text-black/60" : "text-ink-soft",
          )}
        >
          {note}
        </p>
      )}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-[10px] border-2 border-ink bg-surface",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-4 py-3">
        <div>
          <h2 className="font-heading text-base font-extrabold tracking-[-0.03em]">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-[11px] leading-snug text-ink-soft">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function DataTable({
  head,
  children,
  minWidth = 900,
  footer,
}: {
  head: { label: string; align?: "left" | "right" | "center" }[];
  children: React.ReactNode;
  minWidth?: number;
  footer?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[10px] border-2 border-ink bg-surface shadow-offset-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" style={{ minWidth }}>
          <thead className="bg-secondary/70">
            <tr className="border-b-2 border-ink text-left font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
              {head.map((cell) => (
                <th
                  key={cell.label}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-3 py-2.5 font-medium",
                    cell.align === "right" && "text-right",
                    cell.align === "center" && "text-center",
                  )}
                >
                  {cell.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {footer && <div className="border-t-2 border-ink">{footer}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="grid place-items-center gap-4 rounded-[10px] border-2 border-dashed border-ink/30 bg-surface px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-[8px] border-2 border-ink bg-secondary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="display-3">{title}</p>
        <p className="mx-auto mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function TablePager({
  page,
  totalPages,
  total,
  perPage,
  basePath,
  params = {},
  noun = "rows",
}: {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  basePath: string;
  params?: Record<string, string | undefined>;
  noun?: string;
}) {
  const hrefFor = (next: number) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    if (next > 1) search.set("page", String(next));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (value) =>
      totalPages <= 5 ||
      value === 1 ||
      value === totalPages ||
      Math.abs(value - page) <= 1,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
        {total === 0
          ? `No ${noun}`
          : `Showing ${from}–${to} of ${total} ${noun}`}
      </p>
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Button asChild variant="outline" size="icon-sm" aria-label="Previous page">
            <Link href={hrefFor(page - 1)}>
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon-sm"
            disabled
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
        )}

        {pages.map((value, index) => {
          const previous = pages[index - 1];
          const gap = previous && value - previous > 1;
          return (
            <span key={value} className="contents">
              {gap && (
                <span className="px-1 font-mono text-[10px] text-ink-soft">
                  …
                </span>
              )}
              <Button
                asChild
                size="icon-sm"
                variant={value === page ? "default" : "outline"}
                aria-label={`Page ${value}`}
                aria-current={value === page ? "page" : undefined}
              >
                <Link href={hrefFor(value)}>{value}</Link>
              </Button>
            </span>
          );
        })}

        {page < totalPages ? (
          <Button asChild variant="outline" size="icon-sm" aria-label="Next page">
            <Link href={hrefFor(page + 1)}>
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="icon-sm" disabled aria-label="Next page">
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}

export const BOOKING_TONE: Record<BookingStatus, StatusTone> = {
  active: "green",
  upcoming: "blue",
  completed: "neutral",
  cancelled: "red",
};

export const PAYMENT_TONE: Record<PaymentStatus, StatusTone> = {
  paid: "green",
  pending: "amber",
  refunded: "blue",
  failed: "red",
};

export const EQUIPMENT_TONE: Record<EquipmentStatus, StatusTone> = {
  approved: "green",
  pending: "amber",
  rejected: "red",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <StatusBadge tone={BOOKING_TONE[status]}>{status}</StatusBadge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <StatusBadge tone={PAYMENT_TONE[status]}>{status}</StatusBadge>;
}

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  return <StatusBadge tone={EQUIPMENT_TONE[status]}>{status}</StatusBadge>;
}

export function FilterTabs({
  options,
  current,
  basePath,
  params = {},
  allValue = "all",
  label = "Filter",
}: {
  options: { value: string; label: string; count?: number }[];
  current: string;
  basePath: string;
  params?: Record<string, string | undefined>;
  allValue?: string;
  label?: string;
}) {
  const hrefFor = (value: string) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, entry]) => {
      if (entry) search.set(key, entry);
    });
    if (value === allValue) search.delete("status");
    else search.set("status", value);
    search.delete("page");
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap gap-1 rounded-[6px] border-2 border-ink bg-surface p-1"
    >
      {options.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={hrefFor(option.value)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
              active
                ? "bg-ink text-background"
                : "text-ink-soft hover:bg-secondary hover:text-foreground",
            )}
          >
            {option.label}
            {typeof option.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[9px] tabular-nums",
                  active ? "bg-background/20" : "bg-secondary",
                )}
              >
                {option.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
