"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type EquipmentHold = {
  startDate: string;
  endDate: string;
  status: string;
};

const pad = (value: number) => String(value).padStart(2, "0");
const toKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const fromKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function AvailabilityCalendar({
  holds,
  nextOpen,
  today,
}: {
  holds: EquipmentHold[];
  nextOpen?: string;
  today: string;
}) {
  const start = fromKey(today);
  const [month, setMonth] = useState(
    new Date(start.getFullYear(), start.getMonth(), 1),
  );

  const todayKey = toKey(start);
  const booked = holds.filter((hold) => hold.status !== "cancelled");

  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
    ),
  ];

  const monthsAhead =
    (month.getFullYear() - start.getFullYear()) * 12 +
    (month.getMonth() - start.getMonth());
  const canGoBack = monthsAhead > 0;
  const canGoForward = monthsAhead < 5;

  const isBooked = (key: string) =>
    booked.some((hold) => key >= hold.startDate && key <= hold.endDate);

  const step = (amount: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1));

  return (
    <div className="rounded-[10px] border-2 border-ink bg-surface">
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-4 py-2.5">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="grid size-8 place-items-center rounded-[4px] border-2 border-ink bg-background transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-ink-soft/40"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em]">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canGoForward}
          aria-label="Next month"
          className="grid size-8 place-items-center rounded-[4px] border-2 border-ink bg-background transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:border-ink/20 disabled:text-ink-soft/40"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="p-3.5">
        <div className="grid grid-cols-7 gap-1 pb-1">
          {WEEKDAYS.map((day, index) => (
            <span
              key={`${day}-${index}`}
              className="grid h-6 place-items-center font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, index) => {
            if (!date) return <span key={`empty-${index}`} />;
            const key = toKey(date);
            const past = key < todayKey;
            const isToday = key === todayKey;
            const hold = isBooked(key);

            return (
              <span
                key={key}
                className={cn(
                  "grid aspect-square place-items-center rounded-[4px] border font-mono text-[11px] tabular-nums",
                  hold
                    ? "border-ink bg-ink text-background"
                    : past
                      ? "border-transparent text-ink-soft/40"
                      : "border-ink/15 bg-background text-foreground",
                  isToday && !hold && "border-lime-hover bg-lime-soft font-bold",
                  isToday && hold && "border-2 border-lime",
                )}
                aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]}${hold ? ", booked" : ""}${isToday ? ", today" : ""}`}
              >
                {date.getDate()}
              </span>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 pt-3">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2.5 rounded-[2px] border border-ink/20 bg-background" aria-hidden="true" />
              Open
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2.5 rounded-[2px] bg-ink" aria-hidden="true" />
              Booked
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="size-2.5 rounded-[2px] bg-lime" aria-hidden="true" />
              Today
            </span>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
            {nextOpen ? "Next open" : "Free to book"}
          </p>
        </div>
      </div>
    </div>
  );
}
