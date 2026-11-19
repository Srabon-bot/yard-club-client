import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AVAILABILITY_OPTIONS,
  RENTAL_TYPE_OPTIONS,
  countActiveFilters,
  type CatalogState,
} from "@/lib/equipment-catalog";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const FIELD_LABEL =
  "mb-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft";

function FilterSelect({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className={FIELD_LABEL}>{label}</span>
      <span className="relative block">
        <select
          name={name}
          defaultValue={defaultValue}
          className="h-11 w-full appearance-none rounded-[6px] border-2 border-ink bg-surface pl-3 pr-9 text-sm font-medium outline-none transition-colors hover:bg-secondary focus-visible:border-focus"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
          aria-hidden="true"
        />
      </span>
    </label>
  );
}

function Segmented({
  name,
  options,
  value,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-[6px] border-2 border-ink bg-surface p-1">
      {options.map((option) => (
        <label key={option.value} className="relative">
          <input
            type="radio"
            name={name}
            value={option.value}
            defaultChecked={value === option.value}
            className="peer sr-only"
          />
          <span
            className={cn(
              "block cursor-pointer rounded-[4px] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-soft transition-colors",
              "peer-checked:bg-ink peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface",
            )}
          >
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

export function EquipmentFilters({
  categories,
  state,
}: {
  categories: Category[];
  state: CatalogState;
}) {
  const active = countActiveFilters(state);

  return (
    <form
      action="/equipment"
      method="get"
      aria-label="Search and filter equipment"
      className="overflow-hidden rounded-[10px] border-2 border-ink bg-background shadow-offset"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-surface px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-[4px] border-2 border-ink bg-lime text-primary-foreground">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          </span>
          <h2 className="font-heading text-base font-extrabold tracking-[-0.03em]">
            Filter the yard
          </h2>
        </div>

        {active > 0 ? (
          <Link
            href="/equipment"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
          >
            Clear {active} {active === 1 ? "filter" : "filters"}
          </Link>
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
            Showing all
          </span>
        )}
      </div>

      <div className="grid gap-5 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
          <label className="block min-w-0">
            <span className={FIELD_LABEL}>Search</span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                defaultValue={state.q}
                placeholder="Excavator, Sony FX6, Mirpur…"
                className="h-11 w-full rounded-[6px] border-2 border-ink bg-surface pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-ink-soft/70 hover:bg-secondary focus-visible:border-focus"
              />
            </span>
          </label>

          <FilterSelect
            name="category"
            label="Category"
            defaultValue={state.category}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect
            name="location"
            label="Location"
            defaultValue={state.location}
          >
            <option value="all">All locations</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
          </FilterSelect>
        </div>

        <div className="grid gap-5 border-t border-ink/15 pt-5 lg:grid-cols-12">
          <fieldset className="min-w-0 lg:col-span-4">
            <legend className={FIELD_LABEL}>Rental type</legend>
            <Segmented
              name="rentalType"
              options={RENTAL_TYPE_OPTIONS}
              value={state.rentalType}
            />
          </fieldset>

          <fieldset className="min-w-0 lg:col-span-4">
            <legend className={FIELD_LABEL}>Availability</legend>
            <Segmented
              name="availability"
              options={AVAILABILITY_OPTIONS}
              value={state.availability}
            />
          </fieldset>

          <fieldset className="min-w-0 lg:col-span-4">
            <legend className={FIELD_LABEL}>Price / day · BDT</legend>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="min"
                min={0}
                step={100}
                inputMode="numeric"
                placeholder="Min"
                aria-label="Minimum price per day in BDT"
                defaultValue={state.min ?? ""}
                className="h-11 min-w-0 flex-1 rounded-[6px] border-2 border-ink bg-surface px-3 font-mono text-sm tabular-nums outline-none transition-colors placeholder:font-sans placeholder:text-ink-soft/70 hover:bg-secondary focus-visible:border-focus"
              />
              <span aria-hidden="true" className="text-ink-soft">
                –
              </span>
              <input
                type="number"
                name="max"
                min={0}
                step={100}
                inputMode="numeric"
                placeholder="Max"
                aria-label="Maximum price per day in BDT"
                defaultValue={state.max ?? ""}
                className="h-11 min-w-0 flex-1 rounded-[6px] border-2 border-ink bg-surface px-3 font-mono text-sm tabular-nums outline-none transition-colors placeholder:font-sans placeholder:text-ink-soft/70 hover:bg-secondary focus-visible:border-focus"
              />
            </div>
          </fieldset>
        </div>

        {state.sort !== "newest" && (
          <input type="hidden" name="sort" value={state.sort} />
        )}

        <div className="flex flex-col gap-3 border-t border-ink/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-soft">
            Can’t find it?{" "}
            <Link
              href="/contact"
              className="font-semibold text-foreground underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Ask the yard
            </Link>
          </p>
          <Button type="submit" className="h-11 w-full px-5 sm:w-auto">
            Apply filters
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </form>
  );
}
