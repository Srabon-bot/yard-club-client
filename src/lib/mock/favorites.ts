import type { Favorite } from "@/lib/types";

/* Saved listings for the signed-in customer. The live API scopes this to the
   session user; the mock keeps one customer's shortlist. */
export const favorites: Favorite[] = [
  { id: "fav-01", customerId: "u-01", equipmentId: "sony-fx6-cinema" },
  { id: "fav-02", customerId: "u-01", equipmentId: "cat-320-excavator" },
  { id: "fav-03", customerId: "u-01", equipmentId: "generator-250kva" },
  { id: "fav-04", customerId: "u-01", equipmentId: "jbl-srx-pa" },
  { id: "fav-05", customerId: "u-01", equipmentId: "stage-deck-2x1" },
];
