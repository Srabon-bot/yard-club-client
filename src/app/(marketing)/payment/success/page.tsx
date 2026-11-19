import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { PrintButton } from "@/components/payment/print-button";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getBooking } from "@/lib/data/bookings";
import { getEquipmentById } from "@/lib/data/equipment";
import { getOwner } from "@/lib/data/owners";
import { daysBetween, formatBDT, formatDate } from "@/lib/format";
import { currentUser } from "@/lib/mock/users";
import { TODAY_ISO } from "@/lib/today";

export const metadata: Metadata = {
  title: "Payment received",
  description: "Your Yardclub rental is paid and confirmed.",
};

export default function PaymentSuccessPage({
  searchParams,
}: PageProps<"/payment/success">) {
  return (
    <section className="container-page py-10 lg:py-14">
      <Suspense fallback={<ReceiptSkeleton />}>
        <Receipt searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function Receipt({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const bookingId = one(params.booking);
  const booking = bookingId ? await getBooking(bookingId) : undefined;

  const equipmentId = one(params.equipment) ?? booking?.equipmentId;
  const item = booking?.equipment ?? (equipmentId ? await getEquipmentById(equipmentId) : undefined);

  if (!item) {
    return (
      <div className="mx-auto max-w-xl rounded-[10px] border-2 border-ink bg-surface p-6 text-center shadow-offset">
        <p className="eyebrow">No receipt found</p>
        <h1 className="display-3 mt-2">This payment page is empty.</h1>
        <p className="mt-2 text-sm text-ink-soft">
          The booking reference is missing or no longer available.
        </p>
        <Button asChild className="mt-5">
          <Link href="/equipment">Browse equipment</Link>
        </Button>
      </div>
    );
  }

  const start = booking?.startDate ?? one(params.start) ?? TODAY_ISO;
  const end = booking?.endDate ?? one(params.end) ?? start;
  const qty = booking?.quantity ?? Math.max(1, Number.parseInt(one(params.qty) ?? "1", 10) || 1);
  const days = daysBetween(start, end);
  const total = booking?.total ?? item.pricePerDay * qty * days;

  const owner = booking?.owner?.name ?? (await getOwner(item.ownerId))?.name ?? "Yardclub owner";
  const customerName = booking?.customer?.name ?? currentUser.name;
  const customerEmail = booking?.customer?.email ?? currentUser.email;
  const address = one(params.address) ?? booking?.address ?? currentUser.address;
  const contact = one(params.contact) ?? booking?.contact ?? currentUser.phone;
  const reference =
    booking?.id ??
    `YC-${start.replaceAll("-", "").slice(2)}-${item.id.replaceAll("-", "").slice(0, 3).toUpperCase()}`;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col items-start justify-between gap-4 print:hidden sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-primary-foreground">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Payment received</p>
            <h1 className="display-2 mt-1">You’re booked.</h1>
            <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-soft">
              The dates are held with {owner}. The handover checklist and
              receipt are ready below.
            </p>
          </div>
        </div>
        <StatusBadge tone="green">Confirmed</StatusBadge>
      </div>

      <article className="print-receipt mt-6 overflow-hidden rounded-[10px] border-2 border-ink bg-surface shadow-offset">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-ink p-5 sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-[6px] border-2 border-ink bg-lime font-mono text-[13px] font-bold text-[#060605]">
              YC
            </span>
            <div>
              <p className="font-heading text-xl font-extrabold leading-none tracking-[-0.05em]">
                yardclub<span className="text-lime-ink">.</span>
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
                Rental receipt
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
              Receipt
            </p>
            <p className="font-mono text-sm font-medium tabular-nums">{reference}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
              Paid {formatDate(TODAY_ISO)} · Stripe test
            </p>
          </div>
        </header>

        <div className="grid gap-5 border-b border-ink/15 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
              Billed to
            </p>
            <p className="mt-1.5 text-sm font-semibold">{customerName}</p>
            <p className="text-xs leading-relaxed text-ink-soft">{customerEmail}</p>
            <p className="text-xs leading-relaxed text-ink-soft">{contact}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{address}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
              Supplied by
            </p>
            <p className="mt-1.5 text-sm font-semibold">{owner}</p>
            <p className="text-xs leading-relaxed text-ink-soft">{item.location}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
              {item.brand} · {item.model}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                  <th scope="col" className="py-2 pr-3 font-medium">Item</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Dates</th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">Days</th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">Qty</th>
                  <th scope="col" className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink/15">
                  <td className="py-3 pr-3">
                    <p className="font-semibold">{item.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                      {item.condition}-grade · {item.location}
                    </p>
                  </td>
                  <td className="py-3 pr-3 font-mono text-xs tabular-nums">
                    {formatDate(start)}
                    <br />
                    {formatDate(end)}
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-xs tabular-nums">{days}</td>
                  <td className="py-3 pr-3 text-right font-mono text-xs tabular-nums">{qty}</td>
                  <td className="py-3 text-right font-mono text-xs tabular-nums">
                    {formatBDT(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ml-auto mt-5 grid w-full max-w-xs gap-2 font-mono text-[10px] uppercase tracking-[0.04em]">
            <div className="flex items-center justify-between gap-3 text-ink-soft">
              <span>Rental</span>
              <span className="tabular-nums text-foreground">{formatBDT(total)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-ink-soft">
              <span>Security deposit</span>
              <span>At handover</span>
            </div>
            <div className="flex items-end justify-between gap-3 border-t-2 border-ink pt-3">
              <span className="text-ink-soft">Paid today</span>
              <span className="font-sans text-xl font-extrabold tabular-nums text-foreground">
                {formatBDT(total)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-[6px] border border-ink/15 bg-secondary/40 p-3 text-[11px] leading-relaxed text-ink-soft">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Keep this receipt for the handover. The owner will check the same
            condition sheet at pickup and return. Free cancellation up to 48
            hours before the start date.
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink bg-lime px-5 py-3 font-mono text-[9px] uppercase tracking-[0.08em] text-[#060605] sm:px-6">
          <span>Yardclub · Dhaka · yardclub.com</span>
          <span>All amounts in BDT</span>
        </footer>
      </article>

      <div className="mt-6 flex flex-col gap-2 print:hidden sm:flex-row">
        <Button asChild className="h-11">
          <Link href="/dashboard/rentals">
            Go to my rentals
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
        <PrintButton />
        <Button asChild variant="ghost" className="h-11">
          <Link href="/equipment">Browse more equipment</Link>
        </Button>
      </div>
    </div>
  );
}

function ReceiptSkeleton() {
  return (
    <div className="mx-auto max-w-3xl" role="status">
      <span className="sr-only">Loading receipt…</span>
      <Skeleton className="h-16 w-64" />
      <Skeleton className="mt-6 h-[520px] rounded-[10px]" />
    </div>
  );
}
