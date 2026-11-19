import type { Analytics } from "@/lib/types";

/* Twelve months of platform activity. The charts read `months`; the stat
   cards read `totals`. Numbers are seeded, not calculated, so they stay put
   between reloads while the UI is being built. */
export const analytics: Analytics = {
  months: [
    { month: "Dec", bookings: 18, revenue: 214000 },
    { month: "Jan", bookings: 22, revenue: 268000 },
    { month: "Feb", bookings: 26, revenue: 312000 },
    { month: "Mar", bookings: 31, revenue: 401000 },
    { month: "Apr", bookings: 28, revenue: 356000 },
    { month: "May", bookings: 35, revenue: 488000 },
    { month: "Jun", bookings: 33, revenue: 442000 },
    { month: "Jul", bookings: 39, revenue: 561000 },
    { month: "Aug", bookings: 44, revenue: 618000 },
    { month: "Sep", bookings: 41, revenue: 574000 },
    { month: "Oct", bookings: 47, revenue: 703000 },
    { month: "Nov", bookings: 38, revenue: 529000 },
  ],
  totals: {
    users: 1284,
    equipment: 24,
    bookings: 342,
    pendingApprovals: 2,
    completedRentals: 287,
    revenue: 5466000,
    listedEquipment: 9,
    completedOwnerRentals: 46,
    earnings: 412000,
  },
  byCategory: [
    { category: "construction", count: 4 },
    { category: "photography", count: 4 },
    { category: "vehicles", count: 4 },
    { category: "agriculture", count: 4 },
    { category: "electronics", count: 4 },
    { category: "event", count: 4 },
  ],
};
