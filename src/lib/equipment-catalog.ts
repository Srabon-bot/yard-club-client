import type {
  AvailabilityFilter,
  EquipmentSort,
} from "@/lib/data/equipment";
import { formatBDT } from "@/lib/format";
import type { CategoryId, RentalType } from "@/lib/types";

export const CATEGORY_IDS: CategoryId[] = [
  "construction",
  "photography",
  "vehicles",
  "agriculture",
  "electronics",
  "event",
];

export const RENTAL_TYPE_OPTIONS: {
  value: RentalType | "all";
  label: string;
}[] = [
  { value: "all", label: "Any" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const AVAILABILITY_OPTIONS: {
  value: AvailabilityFilter;
  label: string;
}[] = [
  { value: "all", label: "Any" },
  { value: "available", label: "Free now" },
  { value: "rented", label: "Out on rent" },
];

export const SORT_OPTIONS: { value: EquipmentSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price low" },
  { value: "price-desc", label: "Price high" },
  { value: "rating", label: "Top rated" },
];

export const SORT_LABEL: Record<EquipmentSort, string> = {
  newest: "recently added",
  "price-asc": "price low to high",
  "price-desc": "price high to low",
  rating: "top rated",
};

export const LOCATION_OPTIONS = ["Dhaka", "Chattogram"] as const;

export type CatalogState = {
  q: string;
  category: CategoryId | "all";
  location: (typeof LOCATION_OPTIONS)[number] | "all";
  rentalType: RentalType | "all";
  availability: AvailabilityFilter;
  min?: number;
  max?: number;
  sort: EquipmentSort;
  page: number;
};

export type CatalogSearchParams = Record<
  string,
  string | string[] | undefined
>;

const one = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const price = (value: string | string[] | undefined) => {
  const raw = one(value)?.trim();
  if (!raw) return undefined;
  const parsed = Number(raw.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.round(parsed);
};

export function parseCatalogState(search: CatalogSearchParams): CatalogState {
  const category = one(search.category);
  const location = one(search.location);
  const rentalType = one(search.rentalType);
  const availability = one(search.availability);
  const sort = one(search.sort);
  const page = Number.parseInt(one(search.page) ?? "1", 10);

  return {
    q: one(search.q)?.trim() ?? "",
    category: CATEGORY_IDS.includes(category as CategoryId)
      ? (category as CategoryId)
      : "all",
    location: LOCATION_OPTIONS.includes(
      location as (typeof LOCATION_OPTIONS)[number],
    )
      ? (location as (typeof LOCATION_OPTIONS)[number])
      : "all",
    rentalType: ["daily", "weekly", "monthly"].includes(rentalType ?? "")
      ? (rentalType as RentalType)
      : "all",
    availability: ["available", "rented"].includes(availability ?? "")
      ? (availability as AvailabilityFilter)
      : "all",
    min: price(search.min),
    max: price(search.max),
    sort: ["price-asc", "price-desc", "rating"].includes(sort ?? "")
      ? (sort as EquipmentSort)
      : "newest",
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  };
}

/* The URL is the source of truth, so every link rebuilds the same query.
   Defaults stay out of the string to keep sharing tidy. */
export function catalogHref(state: CatalogState): string {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category !== "all") params.set("category", state.category);
  if (state.location !== "all") params.set("location", state.location);
  if (state.rentalType !== "all") params.set("rentalType", state.rentalType);
  if (state.availability !== "all") {
    params.set("availability", state.availability);
  }
  if (typeof state.min === "number") params.set("min", String(state.min));
  if (typeof state.max === "number") params.set("max", String(state.max));
  if (state.sort !== "newest") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));

  const query = params.toString();
  return query ? `/equipment?${query}` : "/equipment";
}

export function countActiveFilters(state: CatalogState) {
  return [
    state.q,
    state.category !== "all",
    state.location !== "all",
    state.rentalType !== "all",
    state.availability !== "all",
    typeof state.min === "number" || typeof state.max === "number",
  ].filter(Boolean).length;
}

export type CatalogChip = {
  key: string;
  label: string;
  href: string;
};

export function activeCatalogChips(
  state: CatalogState,
  categories: { id: CategoryId; name: string }[],
): CatalogChip[] {
  const base = { ...state, page: 1 };
  const chips: CatalogChip[] = [];

  if (state.q) {
    chips.push({
      key: "q",
      label: `“${state.q}”`,
      href: catalogHref({ ...base, q: "" }),
    });
  }

  if (state.category !== "all") {
    chips.push({
      key: "category",
      label:
        categories.find((category) => category.id === state.category)?.name ??
        "Category",
      href: catalogHref({ ...base, category: "all" }),
    });
  }

  if (state.location !== "all") {
    chips.push({
      key: "location",
      label: state.location,
      href: catalogHref({ ...base, location: "all" }),
    });
  }

  if (state.rentalType !== "all") {
    chips.push({
      key: "rentalType",
      label:
        RENTAL_TYPE_OPTIONS.find((option) => option.value === state.rentalType)
          ?.label ?? "Rental type",
      href: catalogHref({ ...base, rentalType: "all" }),
    });
  }

  if (state.availability !== "all") {
    chips.push({
      key: "availability",
      label:
        AVAILABILITY_OPTIONS.find(
          (option) => option.value === state.availability,
        )?.label ?? "Availability",
      href: catalogHref({ ...base, availability: "all" }),
    });
  }

  if (typeof state.min === "number" || typeof state.max === "number") {
    const label =
      typeof state.min === "number" && typeof state.max === "number"
        ? `${formatBDT(state.min)}–${formatBDT(state.max)}`
        : typeof state.min === "number"
          ? `From ${formatBDT(state.min)}`
          : `Up to ${formatBDT(state.max as number)}`;
    chips.push({
      key: "price",
      label,
      href: catalogHref({ ...base, min: undefined, max: undefined }),
    });
  }

  return chips;
}
