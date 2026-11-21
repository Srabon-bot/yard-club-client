import { EquipmentEditScreen } from "@/components/dashboard/equipment-edit-screen";
import { requireRole } from "@/lib/api.server";

export default async function AdminEditEquipmentPage({
  params,
}: PageProps<"/admin/equipment/[id]/edit">) {
  const { id } = await params;
  await requireRole("admin", `/admin/equipment/${id}/edit`);
  return <EquipmentEditScreen id={id} area="admin" />;
}
