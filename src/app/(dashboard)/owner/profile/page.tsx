import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading, Panel } from "@/components/dashboard/parts";
import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-form";
import { requireRole } from "@/lib/api.server";
import { getProfile } from "@/lib/data/users";

export const metadata: Metadata = { title: "Owner profile" };

export default async function OwnerProfilePage() {
  await requireRole("owner", "/owner/profile");
  const user = await getProfile();

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Owner"
          title="Your owner profile"
          description="Update your name, contact details and the bio shown on your public owner page."
        />

        <ProfileForm user={user} />

        <Panel title="Password" description="Update your sign-in password.">
          <PasswordForm />
        </Panel>
      </div>
    </DashboardShell>
  );
}
