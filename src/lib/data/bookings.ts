import { bookings } from "@/lib/mock/bookings";
import { equipment } from "@/lib/mock/equipment";
import { users } from "@/lib/mock/users";
import type { Booking, BookingStatus, Equipment, User } from "@/lib/types";

export type BookingRow = Booking & {
  equipment: Equipment | undefined;
  customer: User | undefined;
  owner: User | undefined;
};

export type BookingQuery = {
  customerId?: string;
  ownerId?: string;
  status?: BookingStatus | "all";
  q?: string;
};

export type BookingStats = {
  total: number;
  upcoming: number;
  active: number;
  completed: number;
  cancelled: number;
  revenue: number;
};

const byNewest = (a: Booking, b: Booking) => b.createdAt.localeCompare(a.createdAt);

export async function listBookings(query: BookingQuery = {}): Promise<BookingRow[]> {
  const q = query.q?.trim().toLowerCase();

  return bookings
    .filter((booking) => {
      if (query.customerId && booking.customerId !== query.customerId) return false;
      if (query.ownerId && booking.ownerId !== query.ownerId) return false;
      if (query.status && query.status !== "all" && booking.bookingStatus !== query.status) {
        return false;
      }
      if (!q) return true;
      const item = equipment.find((entry) => entry.id === booking.equipmentId);
      return [booking.id, booking.address, booking.notes, item?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort(byNewest)
    .map((booking) => ({
      ...booking,
      equipment: equipment.find((entry) => entry.id === booking.equipmentId),
      customer: users.find((user) => user.id === booking.customerId),
      owner: users.find((user) => user.id === booking.ownerId),
    }));
}

/* Earliest open day after the last hold on an item. Used by the home hero
   card and the availability calendar; a real API layer will read the same
   shape from the bookings collection. */
export async function getNextAvailableDate(
  equipmentId: string,
): Promise<string | undefined> {
  const holds = bookings
    .filter(
      (booking) =>
        booking.equipmentId === equipmentId &&
        booking.bookingStatus !== "cancelled" &&
        booking.bookingStatus !== "completed",
    )
    .map((booking) => booking.endDate)
    .sort();

  if (holds.length === 0) return undefined;

  const next = new Date(`${holds[holds.length - 1]}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

export async function getBooking(id: string): Promise<BookingRow | undefined> {
  const booking = bookings.find((entry) => entry.id === id);
  if (!booking) return undefined;
  return {
    ...booking,
    equipment: equipment.find((entry) => entry.id === booking.equipmentId),
    customer: users.find((user) => user.id === booking.customerId),
    owner: users.find((user) => user.id === booking.ownerId),
  };
}

export async function getBookingStats(query: BookingQuery = {}): Promise<BookingStats> {
  const rows = await listBookings(query);
  const revenue = rows
    .filter((row) => row.paymentStatus === "paid")
    .reduce((sum, row) => sum + row.total, 0);

  return {
    total: rows.length,
    upcoming: rows.filter((row) => row.bookingStatus === "upcoming").length,
    active: rows.filter((row) => row.bookingStatus === "active").length,
    completed: rows.filter((row) => row.bookingStatus === "completed").length,
    cancelled: rows.filter((row) => row.bookingStatus === "cancelled").length,
    revenue,
  };
}

export async function getOwnerBookings(ownerId: string): Promise<BookingRow[]> {
  return listBookings({ ownerId });
}

export async function getCustomerBookings(customerId: string): Promise<BookingRow[]> {
  return listBookings({ customerId });
}
