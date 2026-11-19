import { equipment } from "@/lib/mock/equipment";
import type { CategoryId, Equipment } from "@/lib/types";

export type EquipmentSort = "newest" | "price-asc" | "price-desc" | "rating";

export type EquipmentQuery = {
  q?: string;
  category?: CategoryId | "all";
  location?: string;
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
};

const matches = (item: Equipment, query: EquipmentQuery) => {
  if (!query.includePending && item.status !== "approved") return false;
  if (query.category && query.category !== "all" && item.category !== query.category) {
    return false;
  }
  if (query.location && query.location !== "all" && !item.location.includes(query.location)) {
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
