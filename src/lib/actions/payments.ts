"use server";

import { ApiError, apiFetch } from "@/lib/api.server";

export type CheckoutActionState =
  | { ok: true; url: string; sessionId: string }
  | { ok: false; error: string };

/**
 * Starts hosted Stripe Checkout through the Express API. Only a booking id is
 * sent; the amount and identity are read from the server-side booking record.
 */
export async function createCheckoutAction(
  bookingId: string,
): Promise<CheckoutActionState> {
  if (!/^[a-f\d]{24}$/i.test(bookingId)) {
    return { ok: false, error: "That booking is missing its id." };
  }

  try {
    const result = await apiFetch<{ url: string; sessionId?: string }>(
      `/api/bookings/${bookingId}/checkout`,
      { method: "POST" },
    );

    if (!result.url) {
      return { ok: false, error: "Stripe did not return a checkout page." };
    }

    return { ok: true, url: result.url, sessionId: result.sessionId ?? "" };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    console.error("Create checkout action failed:", error);
    return { ok: false, error: "Could not open Stripe Checkout. Try again." };
  }
}
