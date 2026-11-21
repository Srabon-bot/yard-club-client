import type { Metadata } from "next";
import Link from "next/link";
import {
  BanknoteIcon,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MiniSparkline } from "@/components/dashboard/overview-charts";
import {
  BookingStatusBadge,
  DashboardHeading,
  EmptyState,
  Panel,
  PaymentStatusBadge,
  StatCard,
} from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { getBookingStats, getCustomerBookings } from "@/lib/data/bookings";
import { formatBDT, formatShortDate } from "@/lib/format";
import { analytics } from "@/lib/mock/analytics";

export const metadata: Metadata = { title: "Dashboard" };

export default async function CustomerOverviewPage() {
  const [stats, allBookings] = await Promise.all([
    getBookingStats({ customerId: "u-01" }),
    getCustomerBookings("u-01"),
  ]);

  const active = allBookings.filter((b) => b.bookingStatus === "active");
  const upcoming = allBookings.filter((b) => b.bookingStatus === "upcoming");

  const sparkValues = analytics.months.slice(-6).map((m) => m.revenue);

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Customer"
          title="Your rentals, at a glance"
          description="A snapshot of what is out, what is coming up, and what you have spent."
        />

        {/* Sparkline */}
        <div className="rounded-[10px] border-2 border-ink bg-surface px-4 pb-3 pt-4 shadow-offset-sm">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
            Spend — last 6 months
          </p>
          <MiniSparkline values={sparkValues} />
        </div>

        {/* Stat cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active rentals"
            value={stats.active}
            icon={CalendarDays}
            accent
          />
          <StatCard
            label="Upcoming"
            value={stats.upcoming}
            icon={CalendarClock}
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={CalendarCheck2}
          />
          <StatCard
            label="Total spend"
            value={formatBDT(stats.revenue)}
            icon={BanknoteIcon}
          />
        </div>

        {/* Active right now */}
        <Panel
          title="Active right now"
          description="Equipment currently out on rental."
          action={
            active.length > 0 ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/rentals?status=active">View all</Link>
              </Button>
            ) : undefined
          }
        >
          {active.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nothing out yet"
              description="Browse equipment and book your first rental."
              action={
                <Button asChild>
                  <Link href="/equipment">Browse equipment</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3">
              {active.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border-2 border-ink/15 bg-secondary/40 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight">
                      {b.equipment?.name ?? "—"}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-ink-soft">
                      {formatShortDate(b.startDate)} →{" "}
                      {formatShortDate(b.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm tabular-nums">
                      {formatBDT(b.total)}
                    </span>
                    <BookingStatusBadge status={b.bookingStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Coming up */}
        <Panel
          title="Coming up"
          description="Confirmed bookings not yet started."
          action={
            upcoming.length > 0 ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/rentals?status=upcoming">View all</Link>
              </Button>
            ) : undefined
          }
        >
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarClock}
              title="Nothing scheduled"
              description="Your confirmed upcoming rentals will appear here."
            />
          ) : (
            <ul className="grid gap-2">
              {upcoming.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-dotted border-ink/15 pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {b.equipment?.name ?? "—"}
                    </p>
                    <p className="font-mono text-[10px] text-ink-soft">
                      {formatShortDate(b.startDate)} →{" "}
                      {formatShortDate(b.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums">
                      {formatBDT(b.total)}
                    </span>
                    <PaymentStatusBadge status={b.paymentStatus} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
