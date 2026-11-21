import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, SearchX, X } from "lucide-react";
import { CatalogPagination } from "@/components/equipment/catalog-pagination";
import { CatalogSkeleton } from "@/components/equipment/catalog-skeleton";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { EquipmentFilters } from "@/components/equipment/equipment-filters";
import { HeroIn, HeroMedia } from "@/components/motion/home-motion";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { listCategories } from "@/lib/data/categories";
import { getEquipmentStats, listEquipment } from "@/lib/data/equipment";
import {
  SORT_LABEL,
  SORT_OPTIONS,
  activeCatalogChips,
  catalogHref,
  countActiveFilters,
  parseCatalogState,
  type CatalogSearchParams,
  type CatalogState,
} from "@/lib/equipment-catalog";
import { formatBDT } from "@/lib/format";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All equipment",
  description:
    "Browse every live listing on Yardclub: excavators, cinema bodies, trailers, generators, farm equipment and event gear from verified owners in Dhaka and Chattogram.",
};

const popular = [
  { label: "Excavator", href: "/equipment?q=Excavator" },
  { label: "Cinema", href: "/equipment?q=Cinema" },
  { label: "Generator", href: "/equipment?q=Generator" },
  { label: "Tractor", href: "/equipment?q=Tractor" },
  { label: "Free today", href: "/equipment?availability=available", accent: true },
];

function ManifestRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dotted border-ink/20 py-2 last:border-b-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
        {label}
      </dt>
      <dd className="font-mono text-sm font-medium tabular-nums">
        {accent ? (
          <span className="inline-flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            {value}
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default async function EquipmentPage({
  searchParams,
}: PageProps<"/equipment">) {
  const [stats, categories] = await Promise.all([
    getEquipmentStats(),
    listCategories(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--ink) 15%, transparent) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, black, transparent 78%)",
          }}
        />

        <div className="container-page relative py-8 lg:py-14">
          <div className="grid items-end gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <HeroIn>
              <nav
                aria-label="Breadcrumb"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft"
              >
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
                <span aria-hidden="true" className="px-2 text-ink/30">
                  /
                </span>
                <span className="text-foreground">Equipment</span>
              </nav>

              <p className="eyebrow mt-5">
                All equipment · {stats.total} live listings
              </p>

              <h1 className="display-1 mt-3 max-w-[13ch]">
                Every machine
                <br />
                in the <span className="yc-marker">yard.</span>
              </h1>

              <p className="lede mt-5 max-w-[56ch]">
                {stats.total} live listings from {stats.owners} owners in Dhaka
                and Chattogram. Search by name or place, narrow by work, rate or
                what’s free today, then hold the dates.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                <span>Popular</span>
                {popular.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full border px-2.5 py-1 transition-colors",
                      item.accent
                        ? "border-success/25 bg-success-soft text-success-text hover:border-success"
                        : "border-ink/20 hover:border-ink hover:bg-secondary",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </HeroIn>

            <HeroMedia className="w-full max-w-[380px] lg:justify-self-end">
              <div className="rounded-[10px] border-2 border-ink bg-surface shadow-offset">
                <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em]">
                    Yard manifest
                  </p>
                  <StatusBadge tone="green">Live</StatusBadge>
                </div>
                <dl className="px-4 py-2">
                  <ManifestRow label="Live listings" value={stats.total} />
                  <ManifestRow
                    label="Free today"
                    value={stats.available}
                    accent
                  />
                  <ManifestRow label="Categories" value={stats.categories} />
                  <ManifestRow label="Owners" value={stats.owners} />
                  <ManifestRow label="Cities" value={stats.cities} />
                </dl>
                <div className="flex items-center justify-between gap-3 border-t-2 border-ink bg-lime px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[#060605]">
                  <span>From {formatBDT(stats.minRate)} /day</span>
                  <span>BDT</span>
                </div>
              </div>
            </HeroMedia>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="border-b-2 border-ink bg-surface">
            <div className="container-page py-6 lg:py-8">
              <CatalogSkeleton />
            </div>
          </section>
        }
      >
        <Catalog searchParams={searchParams} categories={categories} />
      </Suspense>

      <section className="bg-lime text-[#060605]">
        <div className="container-page py-10 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/55">
                Can’t find it in the list?
              </p>
              <h2 className="mt-2 max-w-[17ch] font-heading text-3xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-4xl">
                Tell us the machine. We’ll find the owner.
              </h2>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-black/65">
                Some gear goes out before it is ever listed. Send the category,
                dates and site; the yard replies the same day.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                size="lg"
                className="border-[#060605] bg-[#060605] text-[#f9f9f6] shadow-[3px_3px_0_rgba(6,6,5,0.25)] hover:bg-[#292925] hover:text-[#f9f9f6]"
              >
                <Link href="/contact">
                  Contact the yard
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[#060605] bg-transparent text-[#060605] hover:bg-black/10"
              >
                <Link href="/register">List your gear</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

async function Catalog({
  searchParams,
  categories,
}: {
  searchParams: Promise<CatalogSearchParams>;
  categories: Category[];
}) {
  const parsed = parseCatalogState(await searchParams);

  const result = await listEquipment({
    q: parsed.q || undefined,
    category: parsed.category,
    location: parsed.location === "all" ? undefined : parsed.location,
    rentalType: parsed.rentalType,
    availability: parsed.availability,
    minPrice: parsed.min,
    maxPrice: parsed.max,
    sort: parsed.sort,
    page: parsed.page,
    perPage: 9,
  });

  const state: CatalogState = { ...parsed, page: result.page };
  const ownersById = new Map(
    result.items
      .filter((item) => item.owner)
      .map((item) => [item.ownerId, item.owner!] as const),
  );
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  const chips = activeCatalogChips(state, categories);
  const activeCount = countActiveFilters(state);
  const from =
    result.total === 0 ? 0 : (result.page - 1) * result.perPage + 1;
  const to = Math.min(result.page * result.perPage, result.total);
  const heading =
    activeCount > 0
      ? result.total === 1
        ? "1 match"
        : `${result.total} matches`
      : `${result.total} listings`;

  return (
    <>
      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page py-6 lg:py-8">
          <EquipmentFilters categories={categories} state={state} />

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
                Active
              </span>
              {chips.map((chip) => (
                <Link
                  key={chip.key}
                  href={chip.href}
                  aria-label={`Remove filter ${chip.label}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-lime-soft px-2.5 py-1 font-mono text-[10px] text-lime-ink transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {chip.label}
                  <X
                    className="size-3 opacity-60 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </Link>
              ))}
              <Link
                href="/equipment"
                className="ml-1 font-mono text-[10px] uppercase tracking-[0.08em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
              >
                Clear all
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="container-page py-8 lg:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">The list</p>
              <h2 className="display-3 mt-1">{heading}</h2>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                {result.total > 0
                  ? `Showing ${from}–${to} · sorted by ${SORT_LABEL[state.sort]}`
                  : "Nothing matches these filters"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
                Sort
              </span>
              <div
                role="group"
                aria-label="Sort results"
                className="flex flex-wrap gap-1 rounded-[6px] border-2 border-ink bg-surface p-1"
              >
                {SORT_OPTIONS.map((option) => {
                  const active = state.sort === option.value;
                  return (
                    <Link
                      key={option.value}
                      href={catalogHref({
                        ...state,
                        sort: option.value,
                        page: 1,
                      })}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "rounded-[4px] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors",
                        active
                          ? "bg-ink text-background"
                          : "text-ink-soft hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {option.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {result.items.length > 0 ? (
            <div className="mt-6 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((item, index) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  owner={ownersById.get(item.ownerId)}
                  categoryName={categoryNames.get(item.category) ?? "Equipment"}
                  priority={state.page === 1 && index < 3}
                  available={result.availability[item.id]}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm sm:grid-cols-[auto_1fr] sm:p-8">
              <span className="grid size-12 place-items-center rounded-[8px] border-2 border-ink bg-secondary">
                <SearchX className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="eyebrow">No matches</p>
                <h3 className="display-3 mt-1.5">
                  Nothing in the yard fits that.
                </h3>
                <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-ink-soft">
                  Try a wider price range, another city, or clear one of the
                  filters above. New listings are checked by an admin before
                  they go live.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild className="h-10">
                    <Link href="/equipment">Clear all filters</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 border-2 border-ink"
                  >
                    <Link href="/contact">Ask the yard</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <CatalogPagination
            state={state}
            total={result.total}
            totalPages={result.totalPages}
            perPage={result.perPage}
          />
        </div>
      </section>
    </>
  );
}
