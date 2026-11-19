import { reviews } from "@/lib/mock/reviews";
import type { Review } from "@/lib/types";

export async function listReviews(limit?: number): Promise<Review[]> {
  const sorted = [...reviews].sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getFeaturedReviews(limit = 3): Promise<Review[]> {
  return [...reviews]
    .sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date))
    .slice(0, limit);
}
