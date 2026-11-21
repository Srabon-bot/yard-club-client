"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateBookingAction } from "@/lib/actions/bookings";
import type { BookingStatus, PaymentStatus } from "@/lib/types";

const NEXT_STATUS: Record<
  Exclude<BookingStatus, "completed" | "cancelled">,
  BookingStatus
> = {
  pending: "upcoming",
  upcoming: "active",
  active: "completed",
};

const PAYMENT_OPTIONS: PaymentStatus[] = [
  "unpaid",
  "pending",
  "paid",
  "refunded",
  "failed",
];

export function BookingActions({
  id,
  bookingStatus,
  paymentStatus,
  scope,
}: {
  id: string;
  bookingStatus: BookingStatus;
  paymentStatus?: PaymentStatus;
  scope: "customer" | "owner" | "admin";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [payment, setPayment] = useState<PaymentStatus | "">(
    paymentStatus ?? "",
  );

  const run = (input: {
    bookingStatus?: BookingStatus;
    paymentStatus?: PaymentStatus;
  }) => {
    startTransition(async () => {
      const result = await updateBookingAction({ id, ...input });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Booking updated");
      router.refresh();
    });
  };

  const canAdvance =
    scope !== "customer" && bookingStatus in NEXT_STATUS
      ? (NEXT_STATUS as Record<string, BookingStatus>)[bookingStatus]
      : undefined;
  const canCancel =
    bookingStatus === "pending" || bookingStatus === "upcoming";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {canAdvance && (
        <Button size="sm" disabled={pending} onClick={() => run({ bookingStatus: canAdvance })}>
          {canAdvance === "upcoming"
            ? "Confirm"
            : canAdvance === "active"
              ? "Start"
              : "Complete"}
        </Button>
      )}
      {canCancel && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run({ bookingStatus: "cancelled" })}
        >
          {scope === "customer" ? "Cancel request" : "Decline"}
        </Button>
      )}
      {scope === "admin" && (bookingStatus === "cancelled" || bookingStatus === "completed") && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => run({ bookingStatus: "pending" })}
        >
          Reopen
        </Button>
      )}
      {scope === "admin" && paymentStatus && (
        <div className="flex items-center gap-1">
          <select
            aria-label="Payment status"
            value={payment}
            disabled={pending}
            onChange={(event) => setPayment(event.target.value as PaymentStatus)}
            className="h-8 rounded-[6px] border-2 border-ink bg-background px-2 font-mono text-[10px] uppercase tracking-[0.04em]"
          >
            {PAYMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="outline"
            disabled={pending || !payment || payment === paymentStatus}
            onClick={() => payment && run({ paymentStatus: payment })}
          >
            {pending ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : "Set"}
          </Button>
        </div>
      )}
    </div>
  );
}
