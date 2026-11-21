import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DashboardHeading,
  EmptyState,
  FilterTabs,
} from "@/components/dashboard/parts";
import { OwnerEquipmentTable } from "@/components/dashboard/owner-equipment-table";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/api.server";
import { listMyEquipment } from "@/lib/data/equipment";
import { oneOf } from "@/lib/search-params";

export const metadata: Metadata = { title: "My equipment" };

const STATUSES = ["all", "approved", "pending", "rejected"] as const;

async function OwnerEquipmentContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const raw = typeof sp.status === "string" ? sp.status : "all";
  const status = oneOf(raw, STATUSES, "all");

  const data = await listMyEquipment(status === "all" ? undefined : status);

  return (
    <div className="grid gap-6">
      <DashboardHeading
        eyebrow="Owner"
        title="Manage the fleet"
        description="Every listing with status, rate and booking actions."
        actions={
          <Button asChild>
            <Link href="/owner/add-equipment">Add equipment</Link>
          </Button>
        }
      />

      <FilterTabs
        options={[
          { value: "all", label: "All", count: data.counts.all },
          { value: "approved", label: "Approved", count: data.counts.approved },
          { value: "pending", label: "Pending", count: data.counts.pending },
          { value: "rejected", label: "Rejected", count: data.counts.rejected },
        ]}
        current={status}
        basePath="/owner/equipment"
        label="Filter by status"
      />

      {data.items.length > 0 ? (
        <OwnerEquipmentTable items={data.items} />
      ) : (
        <EmptyState
          icon={Package}
          title="No equipment"
          description={
            status === "all"
              ? "You have not added any equipment yet."
              : `No ${status} listings.`
          }
          action={
            <Button asChild>
              <Link href="/owner/add-equipment">Add equipment</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}

export default async function OwnerEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole("owner", "/owner/equipment");
  return (
    <DashboardShell>
      <Suspense
        fallback={<div className="p-8 font-mono text-xs">Loading fleet...</div>}
      >
        <OwnerEquipmentContent searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}
