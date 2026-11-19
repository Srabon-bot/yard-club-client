"use client";

import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  DashboardHeading,
  Panel,
} from "@/components/dashboard/parts";
import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-form";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock/users";

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
        variant="outline"
        className="border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        onClick={() =>
          toast.error("Contact support to delete your account.", {
            description: "support@yardclub.com",
          })
        }
      >
        Delete account
      </Button>
    </div>
  );
}

export default function CustomerProfilePage() {
  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Customer"
          title="Your account, on paper"
          description="Update your name, photo, phone and delivery address."
        />

        <ProfileForm user={currentUser} />

        <Panel
          title="Password"
          description="Change your sign-in password. If you use Google sign-in, set a password here to also enable email login."
        >
          <PasswordForm />
        </Panel>

        <Panel title="Danger zone">
          <DangerZone />
        </Panel>
      </div>
    </DashboardShell>
  );
}
