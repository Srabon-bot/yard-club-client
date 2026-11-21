"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch, getSessionUser } from "@/lib/api.server";

export type ProfileActionState =
  | { ok: true; message: string }
  | { ok: false; error: string };

const value = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export async function updateProfileAction(
  _previous: ProfileActionState | undefined,
  formData: FormData,
): Promise<ProfileActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in to update your profile." };
  }

  const payload = {
    name: value(formData, "name"),
    phone: value(formData, "phone"),
    address: value(formData, "address"),
    bio: value(formData, "bio"),
    image: value(formData, "image"),
  };

  try {
    await apiFetch<{ user: unknown }>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/owner");
    revalidatePath("/owner/profile");
    revalidatePath("/admin");
    revalidatePath("/admin/profile");
    revalidatePath("/equipment");

    return { ok: true, message: "Profile saved." };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    console.error("Update profile action failed:", error);
    return { ok: false, error: "Could not save your profile. Try again." };
  }
}
