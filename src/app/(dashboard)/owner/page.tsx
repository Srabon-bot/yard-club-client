import type { Metadata } from "next";
import Link from "next/link";
import {
  BanknoteIcon,
  CalendarDays,
  CheckCircle2,
  Package,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  BookingsChart,
  RevenueChart,
} from "@/components/dashboard/overview-charts";
import {
  BookingStatusBadge,
  DashboardHeading,
  EmptyState,
  EquipmentStatusBadge,
  Panel,
  StatCard,
} from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/api.server";
import { getOwnerAnalytics } from "@/lib/data/analytics";
import { getBookingStats, getOwnerBookings } from "@/lib/data/bookings";
import { listMyEquipment } from "@/lib/data/equipment";
import { formatBDT, formatShortDate } from "@/lib/format";

export const metadata: Metadata = { title: "Owner overview" };

export default async function OwnerOverviewPage() {
  await requireRole("owner", "/owner");
  const [bookings, stats, analytics, owned] = await Promise.all([
    getOwnerBookings(),
    getBookingStats(),
    getOwnerAnalytics(),
    listMyEquipment(),
  ]);

  const pendingEquipment = owned.items.filter((item) => item.status === "pending");
  const recentBookings = bookings.slice(0, 5);

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Owner"
          title="The yard, by the numbers"
          description="Earnings, active rentals, pending requests and listing performance."
          actions={
            <Button asChild>
              <Link href="/owner/add-equipment">
                <Plus className="size-4" aria-hidden="true" />
                Add equipment
              </Link>
            </Button>
          }
        />

        {/* Stat cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total earnings"
            value={formatBDT(analytics.totals.earnings)}
            icon={BanknoteIcon}
            accent
          />
          <StatCard
            label="Listed equipment"
            value={analytics.totals.listedEquipment}
            icon={Package}
          />
          <StatCard
            label="Completed rentals"
            value={analytics.totals.completedOwnerRentals}
            icon={CheckCircle2}
          />
          <StatCard
            label="Active right now"
            value={stats.active}
            icon={CalendarDays}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Monthly revenue">
            <RevenueChart months={analytics.months} />
          </Panel>
          <Panel title="Monthly bookings">
            <BookingsChart months={analytics.months} />
          </Panel>
        </div>

        {/* Pending approvals */}
        <Panel
          title="Pending approval"
          description="Listings waiting for admin review."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/owner/equipment">View all equipment</Link>
            </Button>
          }
        >
          {pendingEquipment.length === 0 ? (
            <EmptyState
              icon={Package}
              title="All approved"
              description="No listings are currently awaiting review."
            />
          ) : (
            <ul className="grid gap-2">
              {pendingEquipment.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 border-b border-dotted border-ink/15 pb-2 last:border-b-0 last:pb-0"
                >
                  <span className="text-sm font-semibold">{e.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ink-soft">
                      {formatBDT(e.pricePerDay)}/day
                    </span>
                    <EquipmentStatusBadge status={e.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Recent bookings */}
        <Panel
          title="Recent rentals"
          description="The latest booking activity on your equipment."
          action={
            recentBookings.length > 0 ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/owner/rentals">View all</Link>
              </Button>
            ) : undefined
          }
        >
          {recentBookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No bookings yet"
              description="Your first rental will appear here."
            />
          ) : (
            <ul className="grid gap-2">
              {recentBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-dotted border-ink/15 pb-2 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {b.equipment?.name ?? "—"}
                    </p>
                    <p className="font-mono text-[10px] text-ink-soft">
                      {b.customer?.name ?? "—"} ·{" "}
                      {formatShortDate(b.startDate)} →{" "}
                      {formatShortDate(b.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs tabular-nums">
                      {formatBDT(b.total)}
                    </span>
                    <BookingStatusBadge status={b.bookingStatus} />
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
