"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading, Panel } from "@/components/dashboard/parts";
import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-form";
import { currentAdmin } from "@/lib/mock/users";

export default function AdminProfilePage() {
  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Admin"
          title="Admin profile"
          description="Your Yardclub administrator account details."
        />

        <ProfileForm user={currentAdmin} />

        <Panel
          title="Password"
          description="Update your sign-in password."
        >
          <PasswordForm />
        </Panel>
      </div>
    </DashboardShell>
  );
}
