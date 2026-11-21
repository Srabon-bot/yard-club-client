"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { moderateEquipmentAction } from "@/lib/actions/admin";
import { deleteEquipmentAction } from "@/lib/actions/equipment";
import type { EquipmentStatus } from "@/lib/types";

export function EquipmentModerationActions({
  id,
  name,
  status,
  featured,
}: {
  id: string;
  name: string;
  status: EquipmentStatus;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const moderate = (input: { status?: EquipmentStatus; featured?: boolean }) => {
    startTransition(async () => {
      const result = await moderateEquipmentAction({ id, ...input });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  const remove = () => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteEquipmentAction(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Listing deleted", { description: result.name });
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button asChild size="sm" variant="outline">
        <Link href={`/admin/equipment/${id}/edit`} aria-label={`Edit ${name}`}>
          <Pencil className="size-3.5" aria-hidden="true" />
          Edit
        </Link>
      </Button>
      <Button
        size="sm"
        disabled={pending || status === "approved"}
        onClick={() => moderate({ status: "approved" })}
      >
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending || status === "rejected"}
        onClick={() => moderate({ status: "rejected" })}
      >
        Reject
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending || status === "pending"}
        onClick={() => moderate({ status: "pending" })}
      >
        Unlist
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => moderate({ featured: !featured })}
      >
        {featured ? "Unfeature" : "Feature"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        disabled={pending}
        onClick={remove}
        aria-label={`Delete ${name}`}
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="size-3.5" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
