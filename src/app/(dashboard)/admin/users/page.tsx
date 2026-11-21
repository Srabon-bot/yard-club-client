import type { Metadata } from "next";
import { Suspense } from "react";
import { UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DashboardHeading,
  DataTable,
  EmptyState,
  FilterTabs,
  TablePager,
} from "@/components/dashboard/parts";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";
import { listUsers } from "@/lib/data/users";
import { formatDate } from "@/lib/format";
import { oneOf, positiveInt } from "@/lib/search-params";
import type { UserRole } from "@/lib/types";

export const metadata: Metadata = { title: "All users" };

const ROLES = ["all", "customer", "owner", "admin"] as const;

const ROLE_TONE: Record<UserRole, "green" | "blue" | "amber"> = {
  customer: "green",
  owner: "blue",
  admin: "amber",
};

const PER_PAGE = 8;

async function UsersContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const rawRole = typeof sp.role === "string" ? sp.role : "all";
  const role = oneOf(rawRole, ROLES, "all");
  const page = positiveInt(sp.page);

  const result = await listUsers({ q, role, page, perPage: PER_PAGE });

  const roleParam = role === "all" ? undefined : role;
  const qParam = q || undefined;

  return (
    <div className="grid gap-6">
      <DashboardHeading
        eyebrow="Admin"
        title="Accounts and roles"
        description="Search and manage every registered user."
      />

      {/* Search bar */}
      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, email or phone…"
          className="h-10 flex-1 rounded-[6px] border-2 border-ink bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-lime focus:ring-offset-1"
        />
        <Button type="submit" variant="outline" className="h-10">
          Search
        </Button>
      </form>

      <FilterTabs
        options={[
          { value: "all", label: "All" },
          { value: "customer", label: "Customers" },
          { value: "owner", label: "Owners" },
          { value: "admin", label: "Admins" },
        ]}
        current={role}
        basePath="/admin/users"
        params={{ q: qParam }}
        label="Filter by role"
      />

      {result.items.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No users found"
          description={
            q ? `No results for "${q}".` : "No users match the current filter."
          }
        />
      ) : (
        <DataTable
          minWidth={860}
          head={[
            { label: "Name" },
            { label: "Email" },
            { label: "Role" },
            { label: "Joined" },
            { label: "Status" },
            { label: "Actions" },
          ]}
          footer={
            <TablePager
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              perPage={PER_PAGE}
              basePath="/admin/users"
              params={{ q: qParam, role: roleParam }}
              noun="users"
            />
          }
        >
          {result.items.map((u) => (
            <tr
              key={u.id}
              className="border-b border-ink/10 text-sm last:border-b-0 hover:bg-secondary/40"
            >
              <td className="px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-[6px] border-2 border-ink bg-lime font-mono text-[11px] font-bold text-[#060605]">
                    {u.initials}
                  </span>
                  <span className="font-semibold">{u.name}</span>
                </div>
              </td>
              <td className="px-3 py-3 font-mono text-[11px] text-ink-soft">
                {u.email}
              </td>
              <td className="px-3 py-3">
                <StatusBadge tone={ROLE_TONE[u.role]}>
                  {u.role}
                </StatusBadge>
              </td>
              <td className="px-3 py-3 font-mono text-[11px] text-ink-soft">
                {formatDate(u.joined)}
              </td>
              <td className="px-3 py-3">
                <StatusBadge tone={u.status === "active" ? "green" : "red"}>
                  {u.status}
                </StatusBadge>
              </td>
              <td className="px-3 py-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="pointer-events-none opacity-70"
                >
                  Manage
                </Button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>;
}) {
  return (
    <DashboardShell>
      <Suspense fallback={<div className="p-8 font-mono text-xs">Loading users directory...</div>}>
        <UsersContent searchParams={searchParams} />
      </Suspense>
    </DashboardShell>
  );
}
