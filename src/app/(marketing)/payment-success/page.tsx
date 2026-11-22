import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api.server";
import { formatBDT, formatDate, formatShortDate } from "@/lib/format";
import type { PaymentRecord } from "@/lib/types";

export const metadata: Metadata = { title: "Payment successful" };

type VerifiedPayment = {
  item: {
    id: string;
    bookingRef?: string;
    equipment?: { name: string } | null;
    equipmentSlug?: string;
    equipmentId: string;
    startDate: string;
    endDate: string;
    total: number;
    owner?: { name: string } | null;
  };
  payment: PaymentRecord | null;
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId) redirect("/dashboard/rentals?payment=missing");

  let result: VerifiedPayment;
  try {
    result = await apiFetch<VerifiedPayment>("/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    redirect("/dashboard/rentals?payment=unverified");
  }

  const { item, payment } = result;
  const amount = payment?.amount ?? item.total;
  const paidAt = payment?.paidAt ?? new Date().toISOString();
  const detailHref = `/equipment/${item.equipmentSlug ?? item.equipmentId}`;

  return (
    <section className="border-b-2 border-ink">
      <div className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-2xl rounded-[10px] border-2 border-ink bg-surface p-8 shadow-offset-sm">
          <div className="flex size-12 place-items-center rounded-[6px] border-2 border-ink bg-lime">
            <CheckCircle2 className="size-6 text-ink" aria-hidden="true" />
          </div>
          <p className="eyebrow mt-6">Stripe Checkout</p>
          <h1 className="display-1 mt-2">Payment confirmed.</h1>
          <p className="lede mt-4">
            Your rental is paid and the transaction has been saved. The owner
            will prepare the equipment for your confirmed dates.
          </p>

          <dl className="mt-8 divide-y-2 divide-ink/10 border-y-2 border-ink/10 font-mono text-[11px] uppercase tracking-[0.06em]">
            <div className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-ink-soft">Booking</dt>
              <dd>{item.bookingRef ?? item.id}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-ink-soft">Equipment</dt>
              <dd>{item.equipment?.name ?? "Yardclub rental"}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-ink-soft">Rental dates</dt>
              <dd>
                {formatShortDate(item.startDate)} → {formatShortDate(item.endDate)}
              </dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 py-3">
              <dt className="text-ink-soft">Paid</dt>
              <dd>{formatBDT(amount)} on {formatDate(paidAt)}</dd>
            </div>
            {payment?.paymentIntentId && (
              <div className="flex flex-wrap justify-between gap-2 py-3">
                <dt className="text-ink-soft">Stripe reference</dt>
                <dd className="max-w-[36ch] break-all">{payment.paymentIntentId}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/rentals"
              className="inline-flex items-center gap-2 rounded-[6px] border-2 border-ink bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-background transition-colors hover:bg-ink/90"
            >
              View my rentals
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href={detailHref}
              className="inline-flex items-center rounded-[6px] border-2 border-ink bg-surface px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors hover:bg-secondary"
            >
              View equipment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
