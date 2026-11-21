import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading, Panel } from "@/components/dashboard/parts";
import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-form";
import { requireRole } from "@/lib/api.server";
import { getProfile } from "@/lib/data/users";

export const metadata: Metadata = { title: "Admin profile" };

export default async function AdminProfilePage() {
  await requireRole("admin", "/admin/profile");
  const user = await getProfile();

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Admin"
          title="Admin profile"
          description="Your Yardclub administrator account details."
        />

        <ProfileForm user={user} />

        <Panel title="Password" description="Update your sign-in password.">
          <PasswordForm />
        </Panel>
      </div>
    </DashboardShell>
  );
}
