"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, apiFetch, getSessionUser } from "@/lib/api.server";
import { createCheckoutAction } from "@/lib/actions/payments";
import type { BookingStatus, PaymentStatus } from "@/lib/types";

export type BookingActionState = { ok: true } | { ok: false; error: string };

export type BookingActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

const value = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

export async function createBookingAction(
  _previous: BookingActionState | undefined,
  formData: FormData,
): Promise<BookingActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: "Sign in to send a booking request." };
  }

  const slug = value(formData, "equipmentSlug");
  const payload = {
    equipmentId: value(formData, "equipmentId"),
    startDate: value(formData, "startDate"),
    endDate: value(formData, "endDate"),
    quantity: Number(value(formData, "quantity")),
    contact: value(formData, "contact"),
    address: value(formData, "address"),
    notes: value(formData, "notes"),
  };

  let bookingId = "";
  let reference = "";
  try {
    const result = await apiFetch<{
      item: { id: string; bookingRef?: string };
    }>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    bookingId = result.item.id;
    reference = result.item.bookingRef ?? result.item.id;

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/rentals");
    revalidatePath("/owner");
    revalidatePath("/owner/rentals");
    if (slug) revalidatePath(`/equipment/${slug}`);
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    console.error("Create booking action failed:", error);
    return {
      ok: false,
      error: "Could not send the booking request. Try again.",
    };
  }

  // Payment follows booking confirmation immediately: open hosted Stripe
  // Checkout with the freshly created booking id. Never report success if the
  // checkout session cannot be created.
  const checkout = await createCheckoutAction(bookingId);
  if (!checkout.ok) {
    redirect(
      `/dashboard/rentals?checkoutError=${encodeURIComponent(
        `Booking ${reference} was created, but Stripe Checkout could not be opened: ${checkout.error}`,
      )}`,
    );
  }

  redirect(checkout.url);
}

export async function updateBookingAction(input: {
  id: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
}): Promise<BookingActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Sign in to update bookings." };
  if (!input.id) return { ok: false, error: "That booking is missing its id." };

  try {
    await apiFetch<{ item: unknown }>(
      `/api/bookings/${encodeURIComponent(input.id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          ...(input.bookingStatus
            ? { bookingStatus: input.bookingStatus }
            : {}),
          ...(input.paymentStatus
            ? { paymentStatus: input.paymentStatus }
            : {}),
        }),
      },
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/rentals");
    revalidatePath("/owner");
    revalidatePath("/owner/rentals");
    revalidatePath("/admin");
    revalidatePath("/admin/rentals");

    return { ok: true, id: input.id };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    console.error("Update booking action failed:", error);
    return { ok: false, error: "Could not update the booking. Try again." };
  }
}
