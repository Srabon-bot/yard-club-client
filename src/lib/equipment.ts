import type { Equipment } from "@/lib/types";

/**
 * The API sends `availableNow` after comparing booked units for today. Older
 * mock-shaped objects fall back to the listing quantity.
 */
export function isAvailableNow(item: Equipment): boolean {
  if (typeof item.availableNow === "boolean") return item.availableNow;
  return item.quantity > 0;
}
