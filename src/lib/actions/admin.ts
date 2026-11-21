"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch, getSessionUser } from "@/lib/api.server";
import type { AccountStatus, EquipmentStatus, UserRole } from "@/lib/types";

export type AdminActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

function failure(error: unknown, fallback: string): AdminActionResult {
  if (error instanceof ApiError) return { ok: false, error: error.message };
  console.error(fallback, error);
  return { ok: false, error: fallback };
}

export async function updateUserAction(input: {
  id: string;
  role?: UserRole;
  status?: AccountStatus;
}): Promise<AdminActionResult> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return { ok: false, error: "Only an admin can manage users." };
  }

  try {
    await apiFetch<{ user: unknown }>(
      `/api/admin/users/${encodeURIComponent(input.id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...(input.role ? { role: input.role } : {}),
          ...(input.status ? { status: input.status } : {}),
        }),
      },
    );

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    return { ok: true, message: "User updated." };
  } catch (error) {
    return failure(error, "Could not update that user.");
  }
}

export async function moderateEquipmentAction(input: {
  id: string;
  status?: EquipmentStatus;
  featured?: boolean;
}): Promise<AdminActionResult> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return { ok: false, error: "Only an admin can moderate listings." };
  }

  try {
    await apiFetch<{ item: unknown }>(
      `/api/equipment/${encodeURIComponent(input.id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...(input.status ? { status: input.status } : {}),
          ...(typeof input.featured === "boolean"
            ? { featured: input.featured }
            : {}),
        }),
      },
    );

    revalidatePath("/admin");
    revalidatePath("/admin/equipment");
    revalidatePath("/equipment");
    revalidatePath("/");
    return { ok: true, message: "Listing updated." };
  } catch (error) {
    return failure(error, "Could not update that listing.");
  }
}
