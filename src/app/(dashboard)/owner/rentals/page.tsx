import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarDays } from "lucide-react";
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
import { requireRole } from "@/lib/api.server";
import { getOwnerBookingPage } from "@/lib/data/bookings";
import { formatBDT, formatShortDate } from "@/lib/format";
import { oneOf, positiveInt } from "@/lib/search-params";

export const metadata: Metadata = { title: "Equipment rentals" };

const PER_PAGE = 8;
const STATUSES = ["all", "pending", "upcoming", "active", "completed", "cancelled"] as const;

async function OwnerRentalsContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const rawStatus = typeof sp.status === "string" ? sp.status : "all";
  const status = oneOf(rawStatus, STATUSES, "all");
  const page = positiveInt(sp.page);

  const result = await getOwnerBookingPage({ status, page, perPage: PER_PAGE });
  const { items: rows, counts: stats, total } = result;
  const allCount = stats.all;
  const totalPages = result.totalPages;
  const safePage = result.page;
  const statusParam = status === "all" ? undefined : status;

  return (
    <div className="grid gap-6">
      <DashboardHeading
        eyebrow="Owner"
        title="Equipment out in the field"
        description="All bookings on your listings across all customers."
      />

      <FilterTabs
        options={[
          { value: "all", label: "All", count: allCount },
          { value: "pending", label: "Pending", count: stats.pending },
          { value: "upcoming", label: "Upcoming", count: stats.upcoming },
          { value: "active", label: "Active", count: stats.active },
          { value: "completed", label: "Completed", count: stats.completed },
          { value: "cancelled", label: "Cancelled", count: stats.cancelled },
        ]}
        current={status}
        basePath="/owner/rentals"
        label="Filter by status"
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings found"
          description={
            status === "all"
              ? "You have no bookings on your equipment yet."
              : `No ${status} bookings.`
          }
        />
      ) : (
        <DataTable
          minWidth={960}
          head={[
            { label: "Customer" },
            { label: "Equipment" },
            { label: "Duration" },
            { label: "Qty", align: "center" },
            { label: "Amount", align: "right" },
            { label: "Payment" },
            { label: "Status" },
            { label: "Actions" },
          ]}
          footer={
            <TablePager
              page={safePage}
              totalPages={totalPages}
              total={total}
              perPage={PER_PAGE}
              basePath="/owner/rentals"
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
                <p className="font-semibold">{b.customer?.name ?? "—"}</p>
                <p className="font-mono text-[10px] text-ink-soft">
                  {b.customer?.email ?? ""}
                </p>
              </td>
              <td className="px-3 py-3 font-medium">
                {b.equipment?.name ?? "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-ink-soft">
                {formatShortDate(b.startDate)} →{" "}
                {formatShortDate(b.endDate)}
              </td>
              <td className="px-3 py-3 text-center font-mono text-sm">
                {b.quantity}
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
                  scope="owner"
                />
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}

export default async function OwnerRentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireRole("owner", "/owner/rentals");
  return (
    <DashboardShell>
      <Suspense fallback={<div className="p-8 font-mono text-xs">Loading rentals...</div>}>
        <OwnerRentalsContent searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}
