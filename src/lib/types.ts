export type CategoryId =
  | "construction"
  | "photography"
  | "vehicles"
  | "agriculture"
  | "electronics"
  | "event";

export type RentalType = "daily" | "weekly" | "monthly";
export type EquipmentStatus = "approved" | "pending" | "rejected";
export type BookingStatus =
  | "pending"
  | "upcoming"
  | "active"
  | "completed"
  | "cancelled";
export type PaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "refunded"
  | "failed";
export type UserRole = "customer" | "owner" | "admin";
export type AccountStatus = "active" | "suspended";

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
  email?: string;
  image?: string;
  slug?: string;
  listingCount?: number;
  availableCount?: number;
  minRate?: number;
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
  ownerSlug?: string;
  slug?: string;
  status: EquipmentStatus;
  rating: number;
  reviewCount: number;
  createdAt: string;
  terms: string;
  features: string[];
  featured: boolean;
  availableNow?: boolean;
  heldUnits?: number;
  owner?: Owner | null;
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
  equipmentId?: string;
  equipmentSlug?: string;
};

export type Favorite = {
  id: string;
  customerId: string;
  equipmentId: string;
};

export type Booking = {
  id: string;
  bookingRef?: string;
  equipmentId: string;
  equipmentSlug?: string;
  customerId: string;
  ownerId: string;
  ownerSlug?: string;
  startDate: string;
  endDate: string;
  quantity: number;
  total: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  paidAt?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  contact: string;
  address: string;
  notes: string;
};

export type PaymentRecord = {
  id: string;
  bookingId: string;
  bookingRef?: string;
  amount: number;
  currency: string;
  status: "paid" | "failed" | "refunded";
  paidAt?: string;
  paymentIntentId?: string;
  refundId?: string;
};

export type EquipmentHold = {
  startDate: string;
  endDate: string;
  quantity?: number;
  status: string;
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
  status: AccountStatus;
  image?: string;
  bio?: string;
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
