"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateUserAction } from "@/lib/actions/admin";
import type { AccountStatus, UserRole } from "@/lib/types";

const ROLES: UserRole[] = ["customer", "owner", "admin"];
const STATUSES: AccountStatus[] = ["active", "suspended"];

export function UserActions({
  id,
  role,
  status,
  isSelf,
}: {
  id: string;
  role: UserRole;
  status: AccountStatus;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [nextRole, setNextRole] = useState<UserRole>(role);
  const [nextStatus, setNextStatus] = useState<AccountStatus>(status);

  const dirty = nextRole !== role || nextStatus !== status;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select
        aria-label="Role"
        value={nextRole}
        disabled={pending || isSelf}
        onChange={(event) => setNextRole(event.target.value as UserRole)}
        className="h-8 rounded-[6px] border-2 border-ink bg-background px-2 font-mono text-[10px] uppercase tracking-[0.04em] disabled:opacity-60"
      >
        {ROLES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        aria-label="Account status"
        value={nextStatus}
        disabled={pending || isSelf}
        onChange={(event) => setNextStatus(event.target.value as AccountStatus)}
        className="h-8 rounded-[6px] border-2 border-ink bg-background px-2 font-mono text-[10px] uppercase tracking-[0.04em] disabled:opacity-60"
      >
        {STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        disabled={pending || !dirty || isSelf}
        onClick={() =>
          startTransition(async () => {
            const result = await updateUserAction({
              id,
              role: nextRole,
              status: nextStatus,
            });
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            toast.success(result.message);
            router.refresh();
          })
        }
      >
        {pending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-3.5" aria-hidden="true" />
        )}
        Save
      </Button>
    </div>
  );
}
