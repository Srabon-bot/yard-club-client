import { apiFetch } from "@/lib/api.server";
import type { Analytics } from "@/lib/types";

export async function getAdminAnalytics(): Promise<Analytics> {
  return apiFetch<Analytics>("/api/analytics/admin");
}

export async function getOwnerAnalytics(ownerId?: string): Promise<Analytics> {
  const params = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : "";
  return apiFetch<Analytics>(`/api/analytics/owner${params}`);
}
