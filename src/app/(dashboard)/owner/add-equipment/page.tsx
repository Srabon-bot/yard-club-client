"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading } from "@/components/dashboard/parts";
import { EquipmentForm } from "@/components/dashboard/equipment-form";
import { Button } from "@/components/ui/button";
import { createEquipmentAction } from "@/lib/actions/equipment";

export default function OwnerAddEquipmentPage() {
  const [created, setCreated] = useState<{ id: string; name: string } | null>(
    null,
  );

  if (created) {
    return (
      <DashboardShell>
        <div className="grid place-items-center gap-5 rounded-[10px] border-2 border-ink bg-surface px-6 py-16 text-center shadow-offset-sm">
          <span className="grid size-14 place-items-center rounded-[10px] border-2 border-ink bg-lime">
            <CheckCircle2 className="size-7 text-[#060605]" aria-hidden="true" />
          </span>
          <div>
            <p className="display-3">Listing submitted</p>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-soft">
              <strong>{created.name}</strong> is now under review. It will
              appear on the catalogue after admin approval, usually within 24
              hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link href="/owner/equipment">View my equipment</Link>
            </Button>
            <Button onClick={() => setCreated(null)} variant="outline">
              Add another listing
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Owner"
          title="List a new machine"
          description="All fields required. New listings go to Pending and appear after admin approval."
        />

        <EquipmentForm
          action={createEquipmentAction}
          submitLabel="Submit listing"
          statusNote="Status: Pending · Visible after admin approval"
          onSuccess={(result) => {
            setCreated({ id: result.id, name: result.name });
            toast.success("Listing submitted for approval", {
              description: `${result.name} is pending admin review.`,
            });
          }}
        />
      </div>
    </DashboardShell>
  );
}
