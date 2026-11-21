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
import {
  OwnerEquipmentTable,
  type OwnerEquipment,
} from "@/components/dashboard/owner-equipment-table";
import { Button } from "@/components/ui/button";
import { ApiError, apiFetch } from "@/lib/api.server";
import { oneOf } from "@/lib/search-params";

export const metadata: Metadata = { title: "My equipment" };

type OwnerEquipmentResponse = {
  items: OwnerEquipment[];
  counts: {
    all: number;
    approved: number;
    pending: number;
    rejected: number;
  };
};

const STATUSES = ["all", "approved", "pending", "rejected"] as const;

async function OwnerEquipmentContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const raw = typeof sp.status === "string" ? sp.status : "all";
  const status = oneOf(raw, STATUSES, "all");

  let data: OwnerEquipmentResponse;
  try {
    const query = status === "all" ? "" : `?status=${status}`;
    data = await apiFetch<OwnerEquipmentResponse>(
      `/api/equipment/mine${query}`,
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const needsLogin = error.status === 401;
      return (
        <div className="grid gap-6">
          <DashboardHeading
            eyebrow="Owner"
            title="Manage the fleet"
            description="Every listing with status, rate and booking actions."
          />
          <EmptyState
            icon={Package}
            title={needsLogin ? "Sign in to manage your fleet" : "Could not load your fleet"}
            description={error.message}
            action={
              needsLogin ? (
                <Button asChild>
                  <Link href="/login">Log in</Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link href="/owner/equipment">Try again</Link>
                </Button>
              )
            }
          />
        </div>
      );
    }
    throw error;
  }

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

export default function OwnerEquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
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
