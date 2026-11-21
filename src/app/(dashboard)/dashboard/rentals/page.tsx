import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { BookingActions } from "@/components/dashboard/booking-actions";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  BookingStatusBadge,
  DashboardHeading,
  DataTable,
  EmptyState,
  FilterTabs,
  PaymentStatusBadge,
  TablePager,
} from "@/components/dashboard/parts";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/api.server";
import {
  getCustomerBookingPage,
  getCustomerBookingStats,
} from "@/lib/data/bookings";
import { formatBDT, formatDate, formatShortDate } from "@/lib/format";
import { oneOf, positiveInt } from "@/lib/search-params";

export const metadata: Metadata = { title: "My rentals" };

const PER_PAGE = 8;
const STATUSES = ["all", "pending", "upcoming", "active", "completed", "cancelled"] as const;

async function CustomerRentalsContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; requested?: string }>;
}) {
  const sp = await searchParams;
  const rawStatus = typeof sp.status === "string" ? sp.status : "all";
  const status = oneOf(rawStatus, STATUSES, "all");
  const page = positiveInt(sp.page);
  const requested = typeof sp.requested === "string" ? sp.requested : "";

  const [stats, filteredResult] = await Promise.all([
    getCustomerBookingStats(),
    getCustomerBookingPage({ status }),
  ]);

  const filtered = filteredResult.items;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const statusParam = status === "all" ? undefined : status;

  return (
    <div className="grid gap-6">
      <DashboardHeading
        eyebrow="Customer"
        title="Every rental, one ledger"
        description="All your bookings, their payment state and receipts."
        actions={
          <Button asChild>
            <Link href="/equipment">Browse equipment</Link>
          </Button>
        }
      />

      {requested && (
        <p
          role="status"
          className="rounded-[8px] border-2 border-ink bg-lime px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#060605]"
        >
          Request {requested} sent. The owner will confirm your dates before payment is enabled.
        </p>
      )}

      <FilterTabs
        options={[
          { value: "all", label: "All", count: stats.all },
          { value: "pending", label: "Pending", count: stats.pending },
          { value: "upcoming", label: "Upcoming", count: stats.upcoming },
          { value: "active", label: "Active", count: stats.active },
          { value: "completed", label: "Completed", count: stats.completed },
          { value: "cancelled", label: "Cancelled", count: stats.cancelled },
        ]}
        current={status}
        basePath="/dashboard/rentals"
        label="Filter by status"
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No rentals found"
          description={
            status === "all"
              ? "You have not made any bookings yet."
              : `No ${status} bookings.`
          }
          action={
            status === "all" ? (
              <Button asChild>
                <Link href="/equipment">Browse equipment</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <DataTable
          minWidth={860}
          head={[
            { label: "Equipment" },
            { label: "Dates" },
            { label: "Booked" },
            { label: "Total", align: "right" },
            { label: "Payment" },
            { label: "Status" },
            { label: "Actions" },
          ]}
          footer={
            <TablePager
              page={safePage}
              totalPages={totalPages}
              total={filtered.length}
              perPage={PER_PAGE}
              basePath="/dashboard/rentals"
              params={{ status: statusParam }}
              noun="bookings"
            />
          }
        >
          {rows.map((b) => (
            <tr
              key={b.id}
              className="border-b border-ink/10 text-sm last:border-b-0 hover:bg-secondary/40"
            >
              <td className="px-3 py-3">
                <Link
                  href={`/equipment/${b.equipmentSlug ?? b.equipmentId}`}
                  className="font-semibold hover:underline"
                >
                  {b.equipment?.name ?? "—"}
                </Link>
                <p className="font-mono text-[10px] text-ink-soft">
                  #{b.id}
                </p>
              </td>
              <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-ink-soft">
                {formatShortDate(b.startDate)} →{" "}
                {formatShortDate(b.endDate)}
              </td>
              <td className="px-3 py-3 font-mono text-[11px] text-ink-soft">
                {formatDate(b.createdAt)}
              </td>
              <td className="px-3 py-3 text-right font-mono text-[12px] tabular-nums">
                {formatBDT(b.total)}
              </td>
              <td className="px-3 py-3">
                <PaymentStatusBadge status={b.paymentStatus} />
              </td>
              <td className="px-3 py-3">
                <BookingStatusBadge status={b.bookingStatus} />
              </td>
              <td className="px-3 py-3">
                <BookingActions
                  key={`${b.id}-${b.bookingStatus}`}
                  id={b.id}
                  bookingStatus={b.bookingStatus}
                  scope="customer"
                />
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}

export default async function CustomerRentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; requested?: string }>;
}) {
  await requireRole("customer", "/dashboard/rentals");
  return (
    <DashboardShell>
      <Suspense fallback={<div className="p-8 font-mono text-xs">Loading bookings...</div>}>
        <CustomerRentalsContent searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}
