import { requireRole } from "@/lib/api.server";

/** Owners only, including on a direct load or reload of the form route. */
export default async function OwnerAddEquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("owner", "/owner/add-equipment");
  return children;
}
