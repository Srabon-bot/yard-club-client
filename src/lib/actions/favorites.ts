"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch, getSessionUser } from "@/lib/api.server";

export type FavoriteActionResult =
  | { ok: true; saved: boolean }
  | { ok: false; error: string };

export async function toggleFavoriteAction(
  equipmentId: string,
  shouldSave: boolean,
): Promise<FavoriteActionResult> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in to save equipment." };
  }
  if (!equipmentId) {
    return { ok: false, error: "That listing is missing its id." };
  }

  try {
    if (shouldSave) {
      await apiFetch<{ saved: boolean }>("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ equipmentId }),
      });
    } else {
      await apiFetch<{ removed: boolean }>(
        `/api/favorites/${encodeURIComponent(equipmentId)}`,
        { method: "DELETE" },
      );
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/favorites");
    revalidatePath("/equipment");
    return { ok: true, saved: shouldSave };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    console.error("Favorite action failed:", error);
    return { ok: false, error: "Could not update your saved equipment." };
  }
}
