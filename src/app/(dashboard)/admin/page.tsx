import type { Metadata } from "next";
import Link from "next/link";
import {
  BanknoteIcon,
  CalendarDays,
  CheckCircle2,
  Package,
  UsersRound,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  BookingsChart,
  CategoryDonut,
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
import { listBookings } from "@/lib/data/bookings";
import { formatBDT, formatCompactBDT, formatShortDate } from "@/lib/format";
import { analytics } from "@/lib/mock/analytics";
import { equipment as allEquipment } from "@/lib/mock/equipment";

export const metadata: Metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
  const recentBookings = await listBookings();
  const pendingEquipment = allEquipment.filter((e) => e.status === "pending");
  const last5 = recentBookings.slice(0, 5);

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Admin"
          title="The whole platform"
          description="Users, listings, rentals and revenue across Yardclub."
        />

        {/* Stat cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total revenue"
            value={formatCompactBDT(analytics.totals.revenue)}
            icon={BanknoteIcon}
            accent
          />
          <StatCard
            label="Total users"
            value={analytics.totals.users.toLocaleString()}
            icon={UsersRound}
          />
          <StatCard
            label="Equipment listings"
            value={analytics.totals.equipment}
            icon={Package}
          />
          <StatCard
            label="Total bookings"
            value={analytics.totals.bookings.toLocaleString()}
            icon={CalendarDays}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel title="Revenue by month">
            <RevenueChart months={analytics.months} />
          </Panel>
          <Panel title="Bookings by month">
            <BookingsChart months={analytics.months} />
          </Panel>
        </div>

        {/* Category distribution */}
        <Panel title="Category distribution">
          <CategoryDonut data={analytics.byCategory} />
        </Panel>

        {/* Pending approvals */}
        <Panel
          title="Pending approvals"
          description={`${analytics.totals.pendingApprovals} listing${analytics.totals.pendingApprovals === 1 ? "" : "s"} awaiting review.`}
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/equipment">View all equipment</Link>
            </Button>
          }
        >
          {pendingEquipment.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All clear"
              description="No listings are pending approval right now."
            />
          ) : (
            <ul className="grid gap-2">
              {pendingEquipment.map((e) => {
                return (
                  <li
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-dotted border-ink/15 pb-2 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold">{e.name}</p>
                      <p className="font-mono text-[10px] text-ink-soft capitalize">
                        {e.category} · {e.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{formatBDT(e.pricePerDay)}/day</span>
                      <EquipmentStatusBadge status={e.status} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Recent activity */}
        <Panel
          title="Recent activity"
          description="The last 5 bookings across all customers and owners."
          action={
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/rentals">View all rentals</Link>
            </Button>
          }
        >
          {last5.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No bookings yet"
              description="Rental activity will appear here."
            />
          ) : (
            <ul className="grid gap-2">
              {last5.map((b) => (
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
