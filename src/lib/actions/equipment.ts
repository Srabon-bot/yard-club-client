"use server";

import { revalidatePath } from "next/cache";
import { ApiError, apiFetch, getSessionUser } from "@/lib/api.server";

export type CreateEquipmentResult =
  | { ok: true; id: string; name: string }
  | { ok: false; error: string; field?: string };

const value = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export async function createEquipmentAction(
  formData: FormData,
): Promise<CreateEquipmentResult> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in as an owner to add equipment." };
  }
  if (user.role === "customer") {
    return {
      ok: false,
      error: "Only owner and admin accounts can create listings.",
    };
  }

  const payload = {
    name: value(formData, "name"),
    brand: value(formData, "brand"),
    model: value(formData, "model"),
    category: value(formData, "category"),
    description: value(formData, "description"),
    location: value(formData, "location"),
    quantity: Number(value(formData, "quantity")),
    condition: value(formData, "condition"),
    pricePerDay: Number(value(formData, "pricePerDay")),
    image: value(formData, "image"),
    terms: value(formData, "terms"),
    rentalTypes: formData
      .getAll("rentalTypes")
      .map((entry) => String(entry)),
  };

  try {
    const result = await apiFetch<{ item: { id: string; name: string } }>(
      "/api/equipment",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    revalidatePath("/owner/equipment");
    revalidatePath("/equipment");

    return { ok: true, id: result.item.id, name: result.item.name };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, field: error.field };
    }
    console.error("Create equipment action failed:", error);
    return { ok: false, error: "Could not save the listing. Try again." };
  }
}
