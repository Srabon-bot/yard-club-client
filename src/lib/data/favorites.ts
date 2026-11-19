import { favorites } from "@/lib/mock/favorites";
import { equipment } from "@/lib/mock/equipment";
import type { Equipment, Favorite } from "@/lib/types";

export type FavoriteRow = Favorite & { equipment: Equipment | undefined };

export async function listFavorites(customerId: string): Promise<FavoriteRow[]> {
  return favorites
    .filter((favorite) => favorite.customerId === customerId)
    .map((favorite) => ({
      ...favorite,
      equipment: equipment.find((item) => item.id === favorite.equipmentId),
    }))
    .filter((favorite) => Boolean(favorite.equipment));
}

export async function getFavoriteCount(customerId: string): Promise<number> {
  return favorites.filter((favorite) => favorite.customerId === customerId).length;
}
