export const SITE_NAME = "Yardclub";

export const mainNav = [
  { label: "Equipment", href: "/equipment" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = [
  {
    title: "Rent",
    links: [
      { label: "All equipment", href: "/equipment" },
      { label: "Categories", href: "/equipment" },
      { label: "How it works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Own",
    links: [
      { label: "List your gear", href: "/register" },
      { label: "Owner dashboard", href: "/owner" },
      { label: "Payouts", href: "/how-it-works" },
      { label: "Insurance", href: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Trust & safety", href: "/faq" },
      { label: "Careers", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/faq" },
      { label: "Terms", href: "/faq" },
      { label: "Privacy", href: "/faq" },
      { label: "Refunds", href: "/faq" },
    ],
  },
] as const;

export type DashboardRole = "customer" | "owner" | "admin";

export const dashboardNav: Record<
  DashboardRole,
  { label: string; href: string; icon: "grid" | "box" | "heart" | "user" | "users" | "calendar" | "plus" | "chart" }[]
> = {
  customer: [
    { label: "Overview", href: "/dashboard", icon: "grid" },
    { label: "My rentals", href: "/dashboard/rentals", icon: "calendar" },
    { label: "Favourites", href: "/dashboard/favorites", icon: "heart" },
    { label: "Profile", href: "/dashboard/profile", icon: "user" },
  ],
  owner: [
    { label: "Overview", href: "/owner", icon: "chart" },
    { label: "Add equipment", href: "/owner/add-equipment", icon: "plus" },
    { label: "My equipment", href: "/owner/equipment", icon: "box" },
    { label: "Rental requests", href: "/owner/rentals", icon: "calendar" },
    { label: "Profile", href: "/owner/profile", icon: "user" },
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: "chart" },
    { label: "All users", href: "/admin/users", icon: "users" },
    { label: "All equipment", href: "/admin/equipment", icon: "box" },
    { label: "All rentals", href: "/admin/rentals", icon: "calendar" },
    { label: "Profile", href: "/admin/profile", icon: "user" },
  ],
};
