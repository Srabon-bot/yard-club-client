import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Payment cancelled" };

export default async function PaymentCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking } = await searchParams;

  return (
    <section className="border-b-2 border-ink">
      <div className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-xl rounded-[10px] border-2 border-ink bg-surface p-8 shadow-offset-sm">
          <div className="flex size-12 place-items-center rounded-[6px] border-2 border-ink bg-secondary">
            <XCircle className="size-6 text-ink" aria-hidden="true" />
          </div>
          <p className="eyebrow mt-6">Stripe Checkout</p>
          <h1 className="display-1 mt-2">Payment cancelled.</h1>
          <p className="lede mt-4">
            No charge was made. Your booking stays confirmed, and you can pay
            securely whenever you are ready.
          </p>
          {booking && (
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
              Booking {booking}
            </p>
          )}
          <Link
            href="/dashboard/rentals"
            className="mt-8 inline-flex items-center gap-2 rounded-[6px] border-2 border-ink bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-background transition-colors hover:bg-ink/90"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to my rentals
          </Link>
        </div>
      </div>
    </section>
  );
}
