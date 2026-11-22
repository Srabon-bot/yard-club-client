"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck } from "lucide-react";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { BookingForm } from "@/components/equipment/booking-form";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { daysBetween, formatBDT } from "@/lib/format";
import type { Equipment, EquipmentHold, Owner } from "@/lib/types";

const pad = (value: number) => String(value).padStart(2, "0");

const toISO = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (iso: string, amount: number) => {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + amount);
  return toISO(date);
};

export function BookingPanel({
  item,
  nextOpen,
  today,
  available,
  anchor = "booking",
  booking,
}: {
  item: Equipment;
  nextOpen?: string;
  today: string;
  available: boolean;
  anchor?: string;
  booking: {
    owner?: Owner;
    holds: EquipmentHold[];
    customer: { contact: string; address: string };
  };
}) {
  const firstOpen = nextOpen ?? today;
  const [start, setStart] = useState(firstOpen);
  const [end, setEnd] = useState(addDays(firstOpen, 2));
  const [quantity, setQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const days = daysBetween(start, end);
  const total = item.pricePerDay * quantity * days;
  const minEnd = addDays(start, 1);

  const changeStart = (value: string) => {
    setStart(value);
    if (!value) return;
    if (end <= value) setEnd(addDays(value, 2));
  };

  const changeQuantity = (value: string) => {
    const next = Number.parseInt(value, 10);
    if (!Number.isFinite(next)) return;
    setQuantity(Math.min(item.quantity, Math.max(1, next)));
  };

  const fullPageHref = `/equipment/${item.id}/book?${new URLSearchParams({
    start,
    end,
    qty: String(quantity),
  }).toString()}`;

  return (
    <>
      <div
        id={anchor}
        className="rounded-[10px] border-2 border-ink bg-surface shadow-offset"
      >
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
              From
            </p>
            <p className="font-mono text-xl font-medium tabular-nums">
              {formatBDT(item.pricePerDay)}
              <span className="text-[10px] text-ink-soft"> /day</span>
            </p>
          </div>
          <StatusBadge tone={available ? "green" : "amber"}>
            {available ? "Available" : "On rent"}
          </StatusBadge>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setDialogOpen(true);
          }}
          className="grid gap-4 p-4"
        >
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                Start
              </span>
              <input
                type="date"
                name="start"
                value={start}
                min={nextOpen ?? today}
                onChange={(event) => changeStart(event.target.value)}
                className="h-10 w-full rounded-[6px] border-2 border-ink bg-background px-2 font-mono text-xs outline-none focus-visible:border-focus"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
                End
              </span>
              <input
                type="date"
                name="end"
                value={end}
                min={minEnd}
                onChange={(event) => setEnd(event.target.value)}
                className="h-10 w-full rounded-[6px] border-2 border-ink bg-background px-2 font-mono text-xs outline-none focus-visible:border-focus"
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-ink-soft">
              Quantity
              <span>{item.quantity} in the yard</span>
            </span>
            <input
              type="number"
              name="qty"
              min={1}
              max={item.quantity}
              value={quantity}
              onChange={(event) => changeQuantity(event.target.value)}
              className="h-10 w-full rounded-[6px] border-2 border-ink bg-background px-3 font-mono text-sm tabular-nums outline-none focus-visible:border-focus"
            />
          </label>

          <div className="grid gap-1.5 rounded-[6px] border border-ink/15 bg-background px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.04em]">
            <div className="flex items-center justify-between gap-3 text-ink-soft">
              <span>
                {formatBDT(item.pricePerDay)} × {days} {days === 1 ? "day" : "days"} ×{" "}
                {quantity}
              </span>
              <span className="tabular-nums text-foreground">{formatBDT(total)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-1.5 text-ink-soft">
              <span>Security deposit</span>
              <span>At handover</span>
            </div>
            <div className="flex items-end justify-between gap-3 border-t border-ink/10 pt-1.5">
              <span className="text-ink-soft">Rental total</span>
              <span className="font-sans text-base font-bold tabular-nums text-foreground">
                {formatBDT(total)}
              </span>
            </div>
          </div>

          <Button type="submit" className="h-11 w-full">
            Book now
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-soft">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
            Confirm the details in the next step, then continue to secure Stripe
            Checkout.
          </p>

          <div className="flex items-center justify-between gap-3 border-t border-ink/15 pt-3">
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              Free cancellation up to 48h
            </span>
            <CompareToggle
              id={item.id}
              name={item.name}
              location={item.location}
              image={item.image}
              withLabel
            />
          </div>
        </form>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[10px] border-2 border-ink bg-background p-0 shadow-offset sm:max-w-5xl">
          <DialogHeader className="border-b-2 border-ink px-5 py-4 pr-14">
            <DialogTitle className="font-heading text-xl font-extrabold tracking-[-0.03em]">
              Confirm your booking
            </DialogTitle>
            <DialogDescription className="text-xs text-ink-soft">
              {item.name} · {formatBDT(item.pricePerDay)}/day · {days}{" "}
              {days === 1 ? "day" : "days"} · {quantity}{" "}
              {quantity === 1 ? "unit" : "units"}
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 sm:p-5">
            <BookingForm
              item={item}
              owner={booking.owner}
              holds={booking.holds}
              today={today}
              nextOpen={nextOpen}
              defaults={{ start, end, qty: String(quantity) }}
              customer={booking.customer}
            />
          </div>

          <DialogFooter className="px-5 py-3">
            <Link
              href={fullPageHref}
              className="font-mono text-[10px] uppercase tracking-[0.08em] underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Open the full booking page instead
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
