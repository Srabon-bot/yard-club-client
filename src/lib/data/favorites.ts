import { apiFetch } from "@/lib/api.server";
import type { Equipment, Favorite } from "@/lib/types";

export type FavoriteRow = Favorite & {
  equipment: Equipment | null;
};

type FavoriteResponse = {
  items: (Favorite & {
    equipment: Equipment | null;
    userId?: string;
    equipmentSlug?: string;
  })[];
};

export async function listFavorites(): Promise<FavoriteRow[]> {
  const data = await apiFetch<FavoriteResponse>("/api/favorites");
  return data.items.map((favorite) => ({
    id: favorite.id,
    customerId: favorite.customerId || String(favorite.userId ?? ""),
    equipmentId: favorite.equipmentId,
    equipment: favorite.equipment ?? null,
  }));
}

export async function getFavoriteCount(): Promise<number> {
  const favorites = await listFavorites();
  return favorites.length;
}
