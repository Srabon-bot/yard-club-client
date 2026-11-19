export type CategoryId =
  | "construction"
  | "photography"
  | "vehicles"
  | "agriculture"
  | "electronics"
  | "event";

export type RentalType = "daily" | "weekly" | "monthly";
export type EquipmentStatus = "approved" | "pending" | "rejected";
export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled";
export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type UserRole = "customer" | "owner" | "admin";

export type Category = {
  id: CategoryId;
  name: string;
  short: string;
  code: string;
  description: string;
  count: number;
};

export type Owner = {
  id: string;
  name: string;
  initials: string;
  location: string;
  rating: number;
  reviewCount: number;
  joined: string;
  responseTime: string;
  verified: boolean;
  bio: string;
  phone: string;
};

export type Equipment = {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: CategoryId;
  description: string;
  pricePerDay: number;
  rentalTypes: RentalType[];
  location: string;
  quantity: number;
  condition: "A" | "B" | "C";
  image: string;
  ownerId: string;
  status: EquipmentStatus;
  rating: number;
  reviewCount: number;
  createdAt: string;
  terms: string;
  features: string[];
  featured: boolean;
};

export type Review = {
  id: string;
  name: string;
  initials: string;
  location: string;
  rating: number;
  comment: string;
  equipment: string;
  date: string;
};

export type Favorite = {
  id: string;
  customerId: string;
  equipmentId: string;
};

export type Booking = {
  id: string;
  equipmentId: string;
  customerId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  total: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  contact: string;
  address: string;
  notes: string;
};

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  joined: string;
  phone: string;
  address: string;
  status: "active" | "suspended";
};

export type MonthPoint = {
  month: string;
  bookings: number;
  revenue: number;
};

export type Analytics = {
  months: MonthPoint[];
  totals: {
    users: number;
    equipment: number;
    bookings: number;
    pendingApprovals: number;
    completedRentals: number;
    revenue: number;
    listedEquipment: number;
    completedOwnerRentals: number;
    earnings: number;
  };
  byCategory: { category: CategoryId; count: number }[];
};
