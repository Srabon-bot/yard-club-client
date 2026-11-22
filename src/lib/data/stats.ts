import { cache } from "react";
import { apiPublic } from "@/lib/api.server";

export type PlatformStats = {
  equipment: {
    total: number;
    approved: number;
    pending: number;
    featured: number;
    available: number;
  };
  users: {
    total: number;
    customers: number;
    owners: number;
    admins: number;
  };
  bookings: {
    total: number;
    pending: number;
    active: number;
    completed: number;
    revenue: number;
  };
  categories: number;
  cities: number;
  reviews: number;
  minRate: number;
  averageRating: number;
};

/** Public counters for the landing and catalogue pages. */
export const getPlatformStats = cache(async function getPlatformStats(): Promise<PlatformStats> {
  return apiPublic<PlatformStats>("/api/stats");
});
