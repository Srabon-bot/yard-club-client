import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";
import { getEquipmentById } from "@/lib/data/equipment";
import { equipment } from "@/lib/mock/equipment";

export function generateStaticParams() {
  return equipment.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/equipment/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = await getEquipmentById(id);
  return { title: item ? item.name : "Equipment" };
}

export default async function EquipmentDetailPage({
  params,
}: PageProps<"/equipment/[id]">) {
  const { id } = await params;
  const item = await getEquipmentById(id);
  if (!item) notFound();

  return (
    <PhasePlaceholder
      phase="03"
      title={item.name}
      description={`${item.brand} ${item.model} in ${item.location}. The detail page pairs this listing with availability, owner trust signals and a deposit-aware booking panel.`}
      sections={[
        "Gallery with a category-coded fallback frame",
        "Rate card, rental terms and condition report",
        "Owner card with rating, response time and public profile link",
        "Availability calendar with blocked dates",
        "Booking panel, mobile sticky bar and compare action",
        "Related equipment from the same category",
      ]}
      parent={{ label: "All equipment", href: "/equipment" }}
    />
  );
}
