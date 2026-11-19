import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowLeft,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getEquipmentById } from "@/lib/data/equipment";
import { getOwner } from "@/lib/data/owners";
import { daysBetween, formatBDT, formatDate } from "@/lib/format";
import { currentUser } from "@/lib/mock/users";
import { TODAY_ISO } from "@/lib/today";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete the rental payment through Stripe.",
};

export default function PaymentPage({
  searchParams,
}: PageProps<"/payment">) {
  return (
    <>
      <section className="border-b-2 border-ink bg-surface">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Secure checkout
            <span aria-hidden="true" className="text-ink/25">/</span>
            <span className="text-foreground">Stripe</span>
          </div>
          <StatusBadge tone="amber">Test mode · no live charge</StatusBadge>
        </div>
      </section>

      <section>
        <div className="container-page py-8 lg:py-10">
          <Suspense fallback={<CheckoutSkeleton />}>
            <Checkout searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function Checkout({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const equipmentId = one(params.equipment);
  const item = equipmentId ? await getEquipmentById(equipmentId) : undefined;

  if (!item) {
    return (
      <div className="mx-auto max-w-xl rounded-[10px] border-2 border-ink bg-surface p-6 text-center shadow-offset">
        <p className="eyebrow">Checkout expired</p>
        <h1 className="display-3 mt-2">Nothing to pay for yet.</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Pick a listing and choose the rental dates first.
        </p>
        <Button asChild className="mt-5">
          <Link href="/equipment">Browse equipment</Link>
        </Button>
      </div>
    );
  }

  const start = /^\d{4}-\d{2}-\d{2}$/.test(one(params.start) ?? "")
    ? (one(params.start) as string)
    : TODAY_ISO;
  const end = /^\d{4}-\d{2}-\d{2}$/.test(one(params.end) ?? "")
    ? (one(params.end) as string)
    : start;
  const qty = Math.min(
    item.quantity,
    Math.max(1, Number.parseInt(one(params.qty) ?? "1", 10) || 1),
  );
  const days = daysBetween(start, end);
  const total = item.pricePerDay * qty * days;
  const owner = await getOwner(item.ownerId);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Payment</p>
          <h1 className="display-2 mt-2 max-w-[16ch]">One last step.</h1>
          <p className="lede mt-3 max-w-[52ch]">
            Complete the rental payment for {item.name}. Card details are
            handled by Stripe; Yardclub keeps the booking, not the number.
          </p>
        </div>
        <Link
          href={`/equipment/${item.id}/book?start=${start}&end=${end}&qty=${qty}`}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Edit booking
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <form
          action="/payment/success"
          method="get"
          className="rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm sm:p-6"
        >
          <input type="hidden" name="equipment" value={item.id} />
          <input type="hidden" name="start" value={start} />
          <input type="hidden" name="end" value={end} />
          <input type="hidden" name="qty" value={qty} />
          <input type="hidden" name="contact" value={one(params.contact) ?? currentUser.phone} />
          <input type="hidden" name="address" value={one(params.address) ?? currentUser.address} />
          <input type="hidden" name="notes" value={one(params.notes) ?? ""} />

          <div className="flex items-center justify-between gap-3 border-b-2 border-ink pb-4">
            <p className="inline-flex items-center gap-2 font-heading text-lg font-extrabold tracking-[-0.03em]">
              <CreditCard className="size-4" aria-hidden="true" />
              Card
            </p>
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
              VISA · MC · AMEX
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                Name on card
              </span>
              <input
                type="text"
                autoComplete="cc-name"
                defaultValue={currentUser.name}
                required
                className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-3 text-sm outline-none focus-visible:border-focus"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                Card number
              </span>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  defaultValue="4242 4242 4242 4242"
                  required
                  className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-3 pr-16 font-mono text-sm tracking-[0.06em] outline-none focus-visible:border-focus"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                  Test
                </span>
              </div>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                  Expiry
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  defaultValue="12 / 28"
                  required
                  className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-3 font-mono text-sm outline-none focus-visible:border-focus"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                  CVC
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  defaultValue="123"
                  required
                  className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-3 font-mono text-sm outline-none focus-visible:border-focus"
                />
              </label>
            </div>
          </div>

          <Button type="submit" className="mt-5 h-12 w-full text-base">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Pay {formatBDT(total)}
          </Button>

          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-soft">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            This is a preview checkout. No card is charged and no payment is
            stored. A real Stripe session replaces this step.
          </p>
        </form>

        <aside className="lg:sticky lg:top-[92px]">
          <div className="overflow-hidden rounded-[10px] border-2 border-ink bg-surface shadow-offset">
            <div className="flex items-center gap-3 border-b-2 border-ink p-4">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-[6px] border-2 border-ink bg-secondary">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-base font-extrabold tracking-[-0.03em]">
                  {item.name}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                  {item.location}
                </p>
              </div>
            </div>

            <dl className="grid gap-2 p-4 font-mono text-[10px] uppercase tracking-[0.04em]">
              <div className="flex items-center justify-between gap-3 text-ink-soft">
                <dt>Start</dt>
                <dd className="tabular-nums text-foreground">{formatDate(start)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-ink-soft">
                <dt>End</dt>
                <dd className="tabular-nums text-foreground">{formatDate(end)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-ink-soft">
                <dt>Duration</dt>
                <dd className="tabular-nums text-foreground">
                  {days} {days === 1 ? "day" : "days"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-ink-soft">
                <dt>Quantity</dt>
                <dd className="tabular-nums text-foreground">{qty}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-ink-soft">
                <dt>Rate</dt>
                <dd className="tabular-nums text-foreground">
                  {formatBDT(item.pricePerDay)} /day
                </dd>
              </div>
              <div className="mt-1 flex items-end justify-between gap-3 border-t-2 border-ink pt-3">
                <dt className="text-ink-soft">Due today</dt>
                <dd className="font-sans text-xl font-extrabold tabular-nums text-foreground">
                  {formatBDT(total)}
                </dd>
              </div>
            </dl>

            <div className="border-t-2 border-ink bg-lime px-4 py-3 font-mono text-[9px] uppercase tracking-[0.06em] text-[#060605]">
              Security deposit settled at handover
            </div>
          </div>

          {owner && (
            <p className="mt-4 rounded-[10px] border border-ink/20 bg-surface p-3.5 text-xs leading-relaxed text-ink-soft">
              You’re booking with{" "}
              <span className="font-semibold text-foreground">{owner.name}</span>.
              They reply {owner.responseTime}.{" "}
              <Link
                href={`/owners/${owner.id}`}
                className="underline decoration-ink/30 decoration-2 underline-offset-2 hover:decoration-ink"
              >
                Owner profile
              </Link>
            </p>
          )}
        </aside>
      </div>
    </>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" role="status">
      <span className="sr-only">Loading checkout…</span>
      <Skeleton className="h-[460px] rounded-[10px]" />
      <Skeleton className="h-[340px] rounded-[10px]" />
    </div>
  );
}
