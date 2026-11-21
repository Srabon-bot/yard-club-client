import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading } from "@/components/dashboard/parts";
import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { updateEquipmentAction } from "@/lib/actions/equipment";
import { getEditableEquipment } from "@/lib/data/equipment";

/** Shared owner/admin screen for editing any listing, including pending ones. */
export async function EquipmentEditScreen({
  id,
  area,
}: {
  id: string;
  area: "owner" | "admin";
}) {
  const item = await getEditableEquipment(id);
  if (!item) notFound();

  const backHref = area === "admin" ? "/admin/equipment" : "/owner/equipment";

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow={area === "admin" ? "Admin" : "Owner"}
          title="Edit listing"
          description="Update the listing details below. Approval status is managed separately."
        />

        <EquipmentForm
          action={updateEquipmentAction}
          initialValues={{
            id: item.id,
            name: item.name,
            brand: item.brand,
            model: item.model,
            category: item.category,
            description: item.description,
            location: item.location,
            quantity: item.quantity,
            condition: item.condition,
            pricePerDay: item.pricePerDay,
            rentalTypes: item.rentalTypes,
            image: item.image,
            terms: item.terms,
          }}
          submitLabel="Save changes"
          statusNote={`Current status: ${item.status} · ${backHref === "/admin/equipment" ? "Admin" : "Owner"} view`}
          redirectTo={backHref}
        />
      </div>
    </DashboardShell>
  );
}
