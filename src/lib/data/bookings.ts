import { apiFetch } from "@/lib/api.server";
import { getEquipmentDetail } from "@/lib/data/equipment";
import type {
  Booking,
  BookingStatus,
  Equipment,
  EquipmentHold,
  User,
} from "@/lib/types";

export type BookingRow = Omit<Booking, "equipmentId" | "customerId" | "ownerId"> & {
  equipmentId: string;
  customerId: string;
  ownerId: string;
  equipment: Equipment | null;
  customer: User | null;
  owner: User | null;
};

export type BookingQuery = {
  status?: BookingStatus | "all";
  q?: string;
  page?: number;
  perPage?: number;
};

export type BookingCounts = {
  all: number;
  pending: number;
  upcoming: number;
  active: number;
  completed: number;
  cancelled: number;
};

export type BookingStats = BookingCounts & {
  revenue: number;
};

export type BookingPage = {
  items: BookingRow[];
  counts: BookingCounts;
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

type BookingListResponse = BookingPage;
type CustomerBookingResponse = { items: BookingRow[]; counts: BookingCounts };

function statusParam(status: BookingQuery["status"]): string | undefined {
  return status && status !== "all" ? status : undefined;
}

function pageQuery(query: BookingQuery): string {
  const params = new URLSearchParams();
  const status = statusParam(query.status);
  if (status) params.set("status", status);
  if (query.q) params.set("q", query.q);
  if (query.page) params.set("page", String(query.page));
  if (query.perPage) params.set("limit", String(query.perPage));
  return params.toString();
}

export async function listBookings(
  query: BookingQuery = {},
): Promise<BookingRow[]> {
  const page = await listBookingsPage({ ...query, perPage: query.perPage ?? 100 });
  return page.items;
}

export async function listBookingsPage(
  query: BookingQuery = {},
): Promise<BookingPage> {
  const search = pageQuery(query);
  return apiFetch<BookingListResponse>(
    `/api/bookings${search ? `?${search}` : ""}`,
  );
}

export async function getCustomerBookings(): Promise<BookingRow[]> {
  const data = await apiFetch<CustomerBookingResponse>("/api/bookings/mine");
  return data.items;
}

export async function getCustomerBookingStats(): Promise<BookingStats> {
  const rows = await getCustomerBookings();
  const counts = countsFor(rows);
  const revenue = rows
    .filter(
      (row) =>
        row.paymentStatus === "paid" && row.bookingStatus !== "cancelled",
    )
    .reduce((sum, row) => sum + row.total, 0);

  return { ...counts, revenue };
}

export async function getCustomerBookingPage(
  query: BookingQuery = {},
): Promise<{ items: BookingRow[]; counts: BookingCounts }> {
  const rows = await getCustomerBookings();
  const status = statusParam(query.status);
  const q = query.q?.trim().toLowerCase();

  const filtered = rows.filter((row) => {
    if (status && row.bookingStatus !== status) return false;
    if (!q) return true;
    return [
      row.bookingRef ?? row.id,
      row.address,
      row.notes,
      row.equipment?.name ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return {
    items: filtered,
    counts: countsFor(rows),
  };
}

export async function getOwnerBookings(): Promise<BookingRow[]> {
  return listBookings({ perPage: 100 });
}

export async function getOwnerBookingPage(
  query: BookingQuery = {},
): Promise<BookingPage> {
  return listBookingsPage({ ...query, perPage: query.perPage ?? 100 });
}

export function countsFor(rows: BookingRow[]): BookingCounts {
  return {
    all: rows.length,
    pending: rows.filter((row) => row.bookingStatus === "pending").length,
    upcoming: rows.filter((row) => row.bookingStatus === "upcoming").length,
    active: rows.filter((row) => row.bookingStatus === "active").length,
    completed: rows.filter((row) => row.bookingStatus === "completed").length,
    cancelled: rows.filter((row) => row.bookingStatus === "cancelled").length,
  };
}

export async function getBookingStats(
  query: BookingQuery = {},
): Promise<BookingStats> {
  const rows = await listBookings({ ...query, perPage: 100 });
  const counts = countsFor(rows);
  const revenue = rows
    .filter(
      (row) =>
        row.paymentStatus === "paid" && row.bookingStatus !== "cancelled",
    )
    .reduce((sum, row) => sum + row.total, 0);

  return { ...counts, revenue };
}

/** Last `months` buckets of paid booking value, oldest first. */
export function bookingSpendSeries(
  rows: BookingRow[],
  months = 6,
): number[] {
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      value: 0,
    };
  });

  for (const row of rows) {
    if (row.paymentStatus !== "paid" || row.bookingStatus === "cancelled") continue;
    const date = new Date(row.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const bucket = buckets.find((entry) => entry.key === key);
    if (bucket) bucket.value += row.total;
  }

  return buckets.map((bucket) => bucket.value);
}

export async function getNextAvailableDate(
  equipmentId: string,
): Promise<string | undefined> {
  const detail = await getEquipmentDetail(equipmentId);
  return detail?.nextAvailable;
}

export async function getEquipmentHolds(
  equipmentId: string,
): Promise<EquipmentHold[]> {
  const detail = await getEquipmentDetail(equipmentId);
  return detail?.holds ?? [];
}
