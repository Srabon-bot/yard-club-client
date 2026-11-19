import { analytics } from "@/lib/mock/analytics";
import type { Analytics } from "@/lib/types";

export async function getAdminAnalytics(): Promise<Analytics> {
  return analytics;
}

export async function getOwnerAnalytics(): Promise<Analytics> {
  /* The owner dashboard reads the same month series so the charts share one
     shape. Once the API lands this becomes an owner-scoped aggregation. */
  return analytics;
}
