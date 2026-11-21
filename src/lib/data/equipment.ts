import { ApiError, apiFetch, apiPublic } from "@/lib/api.server";
import { isAvailableNow } from "@/lib/equipment";
import type {
  CategoryId,
  Equipment,
  EquipmentHold,
  EquipmentStatus,
  Owner,
  RentalType,
  Review,
} from "@/lib/types";

export { isAvailableNow };

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
  ownerId?: string;
  ownerSlug?: string;
  featured?: boolean;
};

export type EquipmentPage = {
  items: Equipment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  availability: Record<string, boolean>;
};

export type EquipmentManagementPage = {
  items: Equipment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  counts: {
    all: number;
    approved: number;
    pending: number;
    rejected: number;
  };
};

export type OwnerEquipmentPage = Pick<
  EquipmentManagementPage,
  "items" | "counts"
>;

export type EquipmentStats = {
  total: number;
  available: number;
  owners: number;
  categories: number;
  cities: number;
  minRate: number;
  averageRating: number;
  reviewCount: number;
};

export type EquipmentDetail = {
  item: Equipment;
  owner: Owner | null;
  holds: EquipmentHold[];
  nextAvailable?: string;
  today: string;
  reviews: Review[];
};

type EquipmentPageResponse = {
  items: Equipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availability: Record<string, boolean>;
};

function queryString(query: EquipmentQuery): string {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.category && query.category !== "all") {
    params.set("category", query.category);
  }
  if (query.location && query.location !== "all") {
    params.set("location", query.location);
  }
  if (query.rentalType && query.rentalType !== "all") {
    params.set("rentalType", query.rentalType);
  }
  if (query.availability && query.availability !== "all") {
    params.set("availability", query.availability);
  }
  if (typeof query.minPrice === "number") {
    params.set("minPrice", String(query.minPrice));
  }
  if (typeof query.maxPrice === "number") {
    params.set("maxPrice", String(query.maxPrice));
  }
  if (query.sort) params.set("sort", query.sort);
  if (query.page) params.set("page", String(query.page));
  if (query.perPage) params.set("limit", String(query.perPage));
  if (query.ownerId) params.set("ownerId", query.ownerId);
  if (query.ownerSlug) params.set("ownerSlug", query.ownerSlug);
  if (query.featured) params.set("featured", "true");

  return params.toString();
}

export async function listEquipment(
  query: EquipmentQuery = {},
): Promise<EquipmentPage> {
  const search = queryString(query);
  const data = await apiPublic<EquipmentPageResponse>(
    `/api/equipment${search ? `?${search}` : ""}`,
  );

  return {
    items: data.items,
    total: data.total,
    page: data.page,
    perPage: data.limit,
    totalPages: data.totalPages,
    availability: data.availability ?? {},
  };
}

/** Owner/admin listing management view, including pending and rejected rows. */
export async function listMyEquipment(
  status?: EquipmentStatus,
): Promise<OwnerEquipmentPage> {
  const params = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch<OwnerEquipmentPage>(`/api/equipment/mine${params}`);
}

/** Admin moderation view across every owner and status. */
export async function listAllEquipment(
  query: { status?: EquipmentStatus | "all"; q?: string; page?: number; perPage?: number } = {},
): Promise<EquipmentManagementPage> {
  const params = new URLSearchParams();
  if (query.status && query.status !== "all") {
    params.set("status", query.status);
  }
  if (query.q) params.set("q", query.q);
  if (query.page) params.set("page", String(query.page));
  if (query.perPage) params.set("limit", String(query.perPage));

  const search = params.toString();
  return apiFetch<EquipmentManagementPage>(
    `/api/admin/equipment${search ? `?${search}` : ""}`,
  );
}

export async function getEquipmentStats(): Promise<EquipmentStats> {
  const stats = await apiPublic<EquipmentStats>("/api/equipment/stats");
  return {
    total: stats.total,
    available: stats.available,
    owners: stats.owners,
    categories: stats.categories,
    cities: stats.cities,
    minRate: stats.minRate,
    averageRating: stats.averageRating ?? 0,
    reviewCount: stats.reviewCount ?? 0,
  };
}

export async function getFeaturedEquipment(limit = 6): Promise<Equipment[]> {
  const page = await listEquipment({
    featured: true,
    sort: "rating",
    perPage: limit,
  });

  if (page.items.length > 0) return page.items;

  const fallback = await listEquipment({ sort: "rating", perPage: limit });
  return fallback.items;
}

export async function getEquipmentDetail(
  id: string,
): Promise<EquipmentDetail | undefined> {
  try {
    return await apiPublic<EquipmentDetail>(
      `/api/equipment/${encodeURIComponent(id)}`,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getEquipmentById(
  id: string,
): Promise<Equipment | undefined> {
  const detail = await getEquipmentDetail(id);
  return detail?.item;
}

export async function getEquipmentByIds(ids: string[]): Promise<Equipment[]> {
  const items = await Promise.all(ids.map((id) => getEquipmentById(id)));
  return items.filter((item): item is Equipment => Boolean(item));
}

export async function getRelatedEquipment(
  id: string,
  limit = 3,
): Promise<Equipment[]> {
  const current = await getEquipmentById(id);
  if (!current) return [];

  const page = await listEquipment({
    category: current.category,
    sort: "rating",
    perPage: limit + 1,
  });

  return page.items.filter((item) => item.id !== id).slice(0, limit);
}

export async function getOwnerEquipment(ownerId: string): Promise<Equipment[]> {
  const page = await listEquipment({ ownerId, perPage: 60 });
  return page.items;
}
