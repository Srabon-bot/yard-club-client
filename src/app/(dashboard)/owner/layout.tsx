import { requireRole } from "@/lib/api.server";

/** Owners only — redirects customers to /dashboard and admins to /admin. */
export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("owner", "/owner");
  return <>{children}</>;
}
