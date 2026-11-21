import { EquipmentEditScreen } from "@/components/dashboard/equipment-edit-screen";
import { requireRole } from "@/lib/api.server";

export default async function OwnerEditEquipmentPage({
  params,
}: PageProps<"/owner/equipment/[id]/edit">) {
  const { id } = await params;
  await requireRole(["owner", "admin"], `/owner/equipment/${id}/edit`);
  return <EquipmentEditScreen id={id} area="owner" />;
}
