import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading, Panel } from "@/components/dashboard/parts";
import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-form";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/api.server";
import { getProfile } from "@/lib/data/users";

export const metadata: Metadata = { title: "Profile" };

function DangerZone() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-sm">Delete account</p>
        <p className="mt-0.5 text-[12px] text-ink-soft leading-snug">
          Permanently removes your profile, bookings history and saved
          equipment. This cannot be undone.
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        className="border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <a href="mailto:support@yardclub.com?subject=Delete%20my%20Yardclub%20account">
          Contact support
        </a>
      </Button>
    </div>
  );
}

export default async function CustomerProfilePage() {
  await requireRole("customer", "/dashboard/profile");
  const user = await getProfile();

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Customer"
          title="Your account, on paper"
          description="Update your name, photo, phone and delivery address."
        />

        <ProfileForm user={user} />

        <Panel title="Password" description="Change the password for your sign-in account.">
          <PasswordForm />
        </Panel>

        <Panel title="Danger zone">
          <DangerZone />
        </Panel>
      </div>
    </DashboardShell>
  );
}
