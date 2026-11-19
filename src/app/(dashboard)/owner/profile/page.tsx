"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeading, Panel } from "@/components/dashboard/parts";
import { PasswordForm, ProfileForm } from "@/components/dashboard/profile-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { currentOwner } from "@/lib/mock/users";

const OWNER_BIO =
  "Runs a three-machine fleet out of Mirpur. Every unit goes out with a fresh service log and a spare set of teeth.";

function BioPanelInner() {
  const [bio, setBio] = useState(OWNER_BIO);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.success("Bio saved", {
        description: "Your public owner profile has been updated.",
      });
    }, 600);
  };

  return (
    <div className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="owner-bio" className="text-xs font-semibold">
          Short bio
        </Label>
        <Textarea
          id="owner-bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="rounded-[6px] border-2 border-ink bg-background text-sm"
        />
        <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
          Shown on your public owner profile and equipment listings
        </p>
      </div>
      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="h-10">
          <Save className="size-4" aria-hidden="true" />
          {saving ? "Saving…" : "Save bio"}
        </Button>
      </div>
    </div>
  );
}

export default function OwnerProfilePage() {
  return (
    <DashboardShell>
      <div className="grid gap-6">
        <DashboardHeading
          eyebrow="Owner"
          title="Your owner profile"
          description="Update your name, contact details and the bio shown on your listings."
        />

        <ProfileForm user={currentOwner} />

        <Panel
          title="Owner bio"
          description="A short paragraph shown on your public profile and listing cards."
        >
          <BioPanelInner />
        </Panel>

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
