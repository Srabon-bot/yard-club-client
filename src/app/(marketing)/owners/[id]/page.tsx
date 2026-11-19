import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";
import { getOwner, getOwnerListings } from "@/lib/data/owners";
import { owners } from "@/lib/mock/owners";

export function generateStaticParams() {
  return owners.map((owner) => ({ id: owner.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/owners/[id]">): Promise<Metadata> {
  const { id } = await params;
  const owner = await getOwner(id);
  return { title: owner ? owner.name : "Owner" };
}

export default async function OwnerProfilePage({
  params,
}: PageProps<"/owners/[id]">) {
  const { id } = await params;
  const owner = await getOwner(id);
  if (!owner) notFound();
  const listings = await getOwnerListings(owner.id);

  return (
    <PhasePlaceholder
      phase="10"
      title={owner.name}
      description={`Public owner profile for ${owner.location}. ${listings.length} live listings, a ${owner.rating.toFixed(1)} rating and a response time of ${owner.responseTime}. Built as one of the six extras.`}
      sections={[
        "Owner hero with verification and response time",
        "Rating breakdown and renter reviews",
        "Live listing grid scoped to this owner",
        "Member-since and operating-area details",
        "Report-owner and contact actions",
      ]}
      parent={{ label: "Back to equipment", href: "/equipment" }}
    />
  );
}
