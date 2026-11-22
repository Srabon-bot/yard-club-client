"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import {
  CalendarDays,
  Check,
  Loader2,
  LockKeyhole,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { createBookingAction } from "@/lib/actions/bookings";
import { daysBetween, formatBDT } from "@/lib/format";
import { bypassImageOptimization } from "@/lib/images";
import type { Equipment, EquipmentHold, Owner } from "@/lib/types";

const pad = (value: number) => String(value).padStart(2, "0");

const toISO = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (iso: string, amount: number) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return toISO(date);
};

const validDate = (value: string | undefined, fallback: string) =>
  value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;

export function BookingForm({
  item,
  owner,
  holds,
  today,
  nextOpen,
  defaults,
  customer,
}: {
  item: Equipment;
  owner?: Owner;
  holds: EquipmentHold[];
  today: string;
  nextOpen?: string;
  defaults: { start?: string; end?: string; qty?: string };
  customer: { contact: string; address: string };
}) {
  const first = validDate(defaults.start, nextOpen ?? today);
  const [start, setStart] = useState(first);
  const [end, setEnd] = useState(
    validDate(defaults.end, addDays(first, 2)),
  );
  const [quantity, setQuantity] = useState(() => {
    const parsed = Number.parseInt(defaults.qty ?? "1", 10);
    return Math.min(item.quantity, Math.max(1, Number.isFinite(parsed) ? parsed : 1));
  });
  const [agreed, setAgreed] = useState(false);
  const [state, formAction, pending] = useActionState(
    createBookingAction,
    undefined,
  );

  const days = daysBetween(start, end);
  const total = item.pricePerDay * quantity * days;

  const overlapping = holds.filter(
    (hold) =>
      (hold.status === "active" ||
        hold.status === "upcoming" ||
        hold.status === "pending") &&
      start <= hold.endDate &&
      end >= hold.startDate,
  );
  const heldUnits = overlapping.reduce(
    (sum, hold) => sum + (hold.quantity ?? 1),
    0,
  );
  const availableUnits = Math.max(0, item.quantity - heldUnits);
  const over = quantity > availableUnits;

  const changeStart = (value: string) => {
    setStart(value);
    if (value && end <= value) setEnd(addDays(value, 2));
  };

  const changeQuantity = (next: number) =>
    setQuantity(Math.min(item.quantity, Math.max(1, next)));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <form
        id="booking-form"
        action={formAction}
        className="grid gap-7 rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm sm:p-6"
      >
        <input type="hidden" name="equipmentId" value={item.id} />
        <input type="hidden" name="equipmentSlug" value={item.slug ?? item.id} />

        <fieldset>
          <legend className="eyebrow">01 · Rental window</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                Start date
              </span>
              <input
                type="date"
                name="startDate"
                value={start}
                min={nextOpen ?? today}
                onChange={(event) => changeStart(event.target.value)}
                required
                className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-2.5 font-mono text-xs outline-none focus-visible:border-focus"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                End date
              </span>
              <input
                type="date"
                name="endDate"
                value={end}
                min={addDays(start, 1)}
                onChange={(event) => setEnd(event.target.value)}
                required
                className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-2.5 font-mono text-xs outline-none focus-visible:border-focus"
              />
            </label>

            <div className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                Quantity
              </span>
              <div className="flex h-11 items-center justify-between rounded-[6px] border-2 border-ink bg-background px-1">
                <button
                  type="button"
                  onClick={() => changeQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="grid size-8 place-items-center rounded-[4px] transition-colors hover:bg-secondary disabled:opacity-35"
                >
                  <Minus className="size-3.5" aria-hidden="true" />
                </button>
                <input
                  type="number"
                  name="quantity"
                  min={1}
                  max={item.quantity}
                  value={quantity}
                  onChange={(event) => changeQuantity(Number.parseInt(event.target.value, 10))}
                  className="w-10 [appearance:textfield] bg-transparent text-center font-mono text-sm tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => changeQuantity(quantity + 1)}
                  disabled={quantity >= item.quantity}
                  aria-label="Increase quantity"
                  className="grid size-8 place-items-center rounded-[4px] transition-colors hover:bg-secondary disabled:opacity-35"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge tone={over ? "red" : "green"}>
              {over
                ? `Only ${availableUnits} free on these dates`
                : `${availableUnits} of ${item.quantity} free`}
            </StatusBadge>
            <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
              {days} {days === 1 ? "day" : "days"} · {item.location}
            </span>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-ink pt-6">
          <legend className="eyebrow">02 · Delivery & contact</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                Contact number
              </span>
              <input
                type="tel"
                name="contact"
                defaultValue={customer.contact}
                required
                placeholder="+880 1XXX XXX XXX"
                className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-3 text-sm outline-none placeholder:text-ink-soft/60 focus-visible:border-focus"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                Delivery address
              </span>
              <input
                type="text"
                name="address"
                defaultValue={customer.address}
                required
                className="h-11 w-full rounded-[6px] border-2 border-ink bg-background px-3 text-sm outline-none focus-visible:border-focus"
              />
            </label>
          </div>
          <label className="mt-3 grid gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
              Additional notes
            </span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Site access, operator, delivery window…"
              className="w-full resize-y rounded-[6px] border-2 border-ink bg-background px-3 py-2.5 text-sm outline-none placeholder:text-ink-soft/60 focus-visible:border-focus"
            />
          </label>
        </fieldset>

        <fieldset className="border-t-2 border-ink pt-6">
          <legend className="eyebrow">03 · Terms</legend>
          <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
            {item.terms}
          </p>
          <label className="mt-4 flex items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-[var(--lime)]"
              required
            />
            <span className="leading-relaxed text-ink-soft">
              I agree to the owner’s rental terms and the handover checklist at
              pickup and return.
            </span>
          </label>
        </fieldset>
      </form>

      <aside className="lg:sticky lg:top-[92px]">
        <div className="rounded-[10px] border-2 border-ink bg-surface shadow-offset">
          <div className="flex items-center gap-3 border-b-2 border-ink p-4">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-[6px] border-2 border-ink bg-secondary">
              <Image
                src={item.image}
                alt=""
                fill
                unoptimized={bypassImageOptimization(item.image)}
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div className="min-w-0">
              <p className="truncate font-heading text-base font-extrabold tracking-[-0.03em]">
                {item.name}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                {item.location} · {item.condition}-grade
              </p>
            </div>
          </div>

          <div className="grid gap-2 p-4 font-mono text-[10px] uppercase tracking-[0.04em]">
            <div className="flex items-center justify-between gap-3 text-ink-soft">
              <span>Rate</span>
              <span className="tabular-nums text-foreground">
                {formatBDT(item.pricePerDay)} /day
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-ink-soft">
              <span>Duration</span>
              <span className="tabular-nums text-foreground">
                {days} {days === 1 ? "day" : "days"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-ink-soft">
              <span>Quantity</span>
              <span className="tabular-nums text-foreground">{quantity}</span>
            </div>
            <div className="mt-1 flex items-end justify-between gap-3 border-t-2 border-ink pt-3">
              <span className="text-ink-soft">Total</span>
              <span className="font-sans text-xl font-extrabold tabular-nums text-foreground">
                {formatBDT(total)}
              </span>
            </div>
          </div>

          <div className="border-t-2 border-ink p-4">
            <Button
              type="submit"
              form="booking-form"
              disabled={over || !agreed || pending}
              className="h-11 w-full"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Sending request…
                </>
              ) : (
                "Send booking request"
              )}
            </Button>
            {state && !state.ok && (
              <p
                role="alert"
                className="mt-2 rounded-[6px] border border-red-300 bg-red-50 px-2.5 py-2 text-[11px] leading-relaxed text-red-700 dark:bg-red-950/40 dark:text-red-300"
              >
                {state.error}
              </p>
            )}
            <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-soft">
              <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
              No payment is taken yet. The owner confirms the dates first.
            </p>
            {!agreed && !over && (
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                Tick the terms to continue
              </p>
            )}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink/15 pt-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                Free cancellation 48h
              </span>
              <CompareToggle
                id={item.id}
                name={item.name}
                location={item.location}
                image={item.image}
                withLabel
              />
            </div>
          </div>
        </div>

        {owner && (
          <div className="mt-4 rounded-[10px] border border-ink/20 bg-surface p-4">
            <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em]">
              <ShieldCheck className="size-4 text-success" aria-hidden="true" />
              Supplied by {owner.name}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              {owner.responseTime || "under 30 min"} response ·{" "}
              {owner.rating != null ? `${owner.rating.toFixed(1)} from ` : ""}
              {owner.reviewCount ?? 0} rentals.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

export function BookingAssurance({ item }: { item: Equipment }) {
  return (
    <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
      {[
        `${item.quantity} unit${item.quantity === 1 ? "" : "s"} available`,
        "Handover checklist",
        "Owner confirmation",
      ].map((line) => (
        <span
          key={line}
          className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft"
        >
          <Check className="size-3 text-success" aria-hidden="true" />
          {line}
        </span>
      ))}
    </div>
  );
}
