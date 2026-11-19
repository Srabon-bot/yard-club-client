import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
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
import { getBookingStats, listBookings } from "@/lib/data/bookings";
import { formatBDT, formatShortDate } from "@/lib/format";
import type { BookingStatus } from "@/lib/types";

export const metadata: Metadata = { title: "All rentals" };

const PER_PAGE = 10;

export default async function AdminRentalsPage({
  searchParams,
}: PageProps<"/admin/rentals">) {
  const sp = await searchParams;
  const rawStatus = typeof sp.status === "string" ? sp.status : "all";
  const status = rawStatus as BookingStatus | "all";
  const page = Math.max(1, Number(sp.page ?? "1"));

  const [allBookings, stats] = await Promise.all([
    listBookings(),
    getBookingStats(),
  ]);

  const filtered =
    status === "all"
      ? allBookings
      : allBookings.filter((b) => b.bookingStatus === status);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const statusParam = status === "all" ? undefined : status;

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Admin"
          title="All rental activity"
          description="Every booking across all customers and equipment owners."
        />

        <FilterTabs
          options={[
            { value: "all", label: "All", count: allBookings.length },
            { value: "upcoming", label: "Upcoming", count: stats.upcoming },
            { value: "active", label: "Active", count: stats.active },
            { value: "completed", label: "Completed", count: stats.completed },
            { value: "cancelled", label: "Cancelled", count: stats.cancelled },
          ]}
          current={status}
          basePath="/admin/rentals"
          label="Filter by status"
        />

        {rows.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No bookings found"
            description={
              status === "all"
                ? "No bookings have been made yet."
                : `No ${status} bookings.`
            }
          />
        ) : (
          <DataTable
            minWidth={1060}
            head={[
              { label: "Customer" },
              { label: "Owner" },
              { label: "Equipment" },
              { label: "Duration" },
              { label: "Amount", align: "right" },
              { label: "Payment" },
              { label: "Status" },
            ]}
            footer={
              <TablePager
                page={safePage}
                totalPages={totalPages}
                total={filtered.length}
                perPage={PER_PAGE}
                basePath="/admin/rentals"
                params={{ status: statusParam }}
                noun="bookings"
              />
            }
          >
            {rows.map((b) => (
              <tr
                key={`${b.id}-${b.equipmentId}`}
                className="border-b border-ink/10 text-sm last:border-b-0 hover:bg-secondary/40"
              >
                <td className="px-3 py-3">
                  <p className="font-semibold">{b.customer?.name ?? "—"}</p>
                  <p className="font-mono text-[10px] text-ink-soft">
                    {b.customer?.email ?? ""}
                  </p>
                </td>
                <td className="px-3 py-3 font-mono text-[11px] text-ink-soft">
                  {b.ownerId}
                </td>
                <td className="px-3 py-3 font-medium">
                  {b.equipment?.name ?? "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-ink-soft">
                  {formatShortDate(b.startDate)} →{" "}
                  {formatShortDate(b.endDate)}
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
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </DashboardShell>
  );
}
