import { apiPublic } from "@/lib/api.server";
import type { Review } from "@/lib/types";

export async function listReviews(limit = 24, equipmentId?: string): Promise<Review[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (equipmentId) params.set("equipmentId", equipmentId);

  const data = await apiPublic<{ items: Review[] }>(
    `/api/reviews?${params.toString()}`,
  );
  return data.items;
}

export async function getFeaturedReviews(limit = 3): Promise<Review[]> {
  const reviews = await listReviews(12);
  return [...reviews]
    .sort(
      (a, b) =>
        b.rating - a.rating ||
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .slice(0, limit);
}
