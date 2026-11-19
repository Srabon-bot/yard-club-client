import { bookings } from "@/lib/mock/bookings";
import { categories } from "@/lib/mock/categories";
import { equipment } from "@/lib/mock/equipment";
import type { CategoryId, Equipment, RentalType } from "@/lib/types";

export type EquipmentSort = "newest" | "price-asc" | "price-desc" | "rating";
export type AvailabilityFilter = "all" | "available" | "rented";

export type EquipmentQuery = {
  q?: string;
  category?: CategoryId | "all";
  location?: string;
  rentalType?: RentalType | "all";
  availability?: AvailabilityFilter;
  minPrice?: number;
  maxPrice?: number;
  sort?: EquipmentSort;
  page?: number;
  perPage?: number;
  includePending?: boolean;
};

export type EquipmentPage = {
  items: Equipment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  availability: Record<string, boolean>;
};

/* An item is available when the quantity on the listing is greater than the
   units currently out on an active booking. The real API will read the same
   comparison from the bookings collection. */
export const isAvailableNow = (item: Equipment) => {
  const held = bookings
    .filter(
      (booking) =>
        booking.equipmentId === item.id && booking.bookingStatus === "active",
    )
    .reduce((total, booking) => total + booking.quantity, 0);
  return item.quantity - held > 0;
};

const categoryName = (id: CategoryId) =>
  categories.find((category) => category.id === id)?.name ?? "";

const matches = (item: Equipment, query: EquipmentQuery) => {
  if (!query.includePending && item.status !== "approved") return false;
  if (query.category && query.category !== "all" && item.category !== query.category) {
    return false;
  }
  if (query.location && query.location !== "all" && !item.location.includes(query.location)) {
    return false;
  }
  if (
    query.rentalType &&
    query.rentalType !== "all" &&
    !item.rentalTypes.includes(query.rentalType)
  ) {
    return false;
  }
  if (query.availability === "available" && !isAvailableNow(item)) return false;
  if (query.availability === "rented" && isAvailableNow(item)) return false;
  if (typeof query.minPrice === "number" && item.pricePerDay < query.minPrice) {
    return false;
  }
  if (typeof query.maxPrice === "number" && item.pricePerDay > query.maxPrice) {
    return false;
  }

  const q = query.q?.trim().toLowerCase();
  if (!q) return true;
  return [
    item.name,
    item.brand,
    item.model,
    item.description,
    item.location,
    categoryName(item.category),
    ...item.features,
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
};

const sorters: Record<EquipmentSort, (a: Equipment, b: Equipment) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  "price-asc": (a, b) => a.pricePerDay - b.pricePerDay,
  "price-desc": (a, b) => b.pricePerDay - a.pricePerDay,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

export async function listEquipment(query: EquipmentQuery = {}): Promise<EquipmentPage> {
  const page = Math.max(1, query.page ?? 1);
  const perPage = Math.max(1, query.perPage ?? 9);
  const sort = query.sort ?? "newest";

  const filtered = equipment
    .filter((item) => matches(item, query))
    .sort(sorters[sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);

  return {
    items: filtered.slice((safePage - 1) * perPage, safePage * perPage),
    total,
    page: safePage,
    perPage,
    totalPages,
    availability: Object.fromEntries(
      filtered.map((item) => [item.id, isAvailableNow(item)]),
    ),
  };
}

export type EquipmentStats = {
  total: number;
  available: number;
  owners: number;
  categories: number;
  cities: number;
  minRate: number;
};

export async function getEquipmentStats(): Promise<EquipmentStats> {
  const approved = equipment.filter((item) => item.status === "approved");
  const rates = approved.map((item) => item.pricePerDay);

  return {
    total: approved.length,
    available: approved.filter(isAvailableNow).length,
    owners: new Set(approved.map((item) => item.ownerId)).size,
    categories: new Set(approved.map((item) => item.category)).size,
    cities: new Set(
      approved.map((item) => item.location.split(",").pop()?.trim()),
    ).size,
    minRate: Math.min(...rates),
  };
}

export async function getFeaturedEquipment(limit = 6): Promise<Equipment[]> {
  return equipment
    .filter((item) => item.featured && item.status === "approved")
    .sort(sorters.rating)
    .slice(0, limit);
}

export async function getEquipmentById(id: string): Promise<Equipment | undefined> {
  return equipment.find((item) => item.id === id);
}

export async function getEquipmentByIds(ids: string[]): Promise<Equipment[]> {
  return ids
    .map((id) => equipment.find((item) => item.id === id))
    .filter((item): item is Equipment => Boolean(item));
}

export async function getRelatedEquipment(
  id: string,
  limit = 3,
): Promise<Equipment[]> {
  const current = await getEquipmentById(id);
  if (!current) return [];
  return equipment
    .filter(
      (item) =>
        item.id !== id &&
        item.category === current.category &&
        item.status === "approved",
    )
    .sort(sorters.rating)
    .slice(0, limit);
}

export async function getOwnerEquipment(ownerId: string): Promise<Equipment[]> {
  return equipment
    .filter((item) => item.ownerId === ownerId)
    .sort(sorters.newest);
}

export async function getEquipmentLocations(): Promise<string[]> {
  return [...new Set(equipment.map((item) => item.location))].sort();
}
