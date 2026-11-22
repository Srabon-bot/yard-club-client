import { requireRole } from "@/lib/api.server";

/** Admins only — redirects customers to /dashboard and owners to /owner. */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin", "/admin");
  return <>{children}</>;
}
