"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/site/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileAction } from "@/lib/actions/profile";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/types";

const ROLE_LABEL: Record<User["role"], string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
};

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    undefined,
  );
  const imageRef = useRef(user.image ?? "");
  const nameRef = useRef(user.name);

  useEffect(() => {
    if (!state) return;
    if (!state.ok) {
      toast.error(state.error);
      return;
    }
    toast.success(state.message);

    // The header avatar and account name come from Better Auth's session, which
    // is served from a 5-day cookie cache. Re-apply the saved values through
    // Better Auth so the cache is refreshed without forcing a re-login.
    void authClient
      .updateUser({ image: imageRef.current, name: nameRef.current })
      .catch(() => {
        // Best effort: the profile itself was already saved successfully.
      });
  }, [state]);

  return (
    <form action={formAction} className="grid gap-6">
      <section className="rounded-[10px] border-2 border-ink bg-surface shadow-offset-sm">
        <div className="border-b-2 border-ink px-4 py-3">
          <h2 className="font-heading text-base font-extrabold tracking-[-0.03em]">
            Profile photo
          </h2>
          <p className="mt-0.5 text-[11px] text-ink-soft">
            A clear face or yard mark helps owners and renters recognise you.
          </p>
        </div>
        <div className="p-4">
          <ImageUploadField
            id="profile-image"
            name="image"
            label="Hosted image URL"
            note="Upload with ImgBB or paste a hosted image URL"
            defaultValue={user.image ?? ""}
            onValueChange={(value) => {
              imageRef.current = value;
            }}
            placeholder="https://i.ibb.co/... or direct image link"
          />
        </div>
      </section>

      <section className="rounded-[10px] border-2 border-ink bg-surface shadow-offset-sm">
        <div className="border-b-2 border-ink px-4 py-3">
          <h2 className="font-heading text-base font-extrabold tracking-[-0.03em]">
            Personal details
          </h2>
          <p className="mt-0.5 text-[11px] text-ink-soft">
            Owners see your name and phone on a confirmed booking only.
          </p>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="profile-name" className="text-xs font-semibold">
              Full name
            </Label>
            <Input
              id="profile-name"
              name="name"
              defaultValue={user.name}
              onChange={(event) => {
                nameRef.current = event.target.value;
              }}
              className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile-email" className="text-xs font-semibold">
              Email
            </Label>
            <Input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              className="h-11 rounded-[6px] border-2 border-ink/25 bg-secondary/50 text-sm"
            />
            <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
              Managed by your sign-in account
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile-phone" className="text-xs font-semibold">
              Phone number
            </Label>
            <Input
              id="profile-phone"
              name="phone"
              type="tel"
              defaultValue={user.phone}
              className="h-11 rounded-[6px] border-2 border-ink bg-background font-mono text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="profile-role" className="text-xs font-semibold">
              Account type
            </Label>
            <div
              id="profile-role"
              className="flex h-11 items-center justify-between gap-2 rounded-[6px] border-2 border-ink/25 bg-secondary/50 px-3"
            >
              <span className="text-sm font-semibold">
                {ROLE_LABEL[user.role]}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
                Joined {new Date(user.joined).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="profile-address" className="text-xs font-semibold">
              Address
            </Label>
            <Textarea
              id="profile-address"
              name="address"
              rows={2}
              defaultValue={user.address}
              className="rounded-[6px] border-2 border-ink bg-background text-sm"
            />
            <p className="text-[11px] leading-snug text-ink-soft">
              This is the default pickup and delivery address on your bookings.
            </p>
          </div>

          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="profile-bio" className="text-xs font-semibold">
              Short bio
            </Label>
            <Textarea
              id="profile-bio"
              name="bio"
              rows={3}
              defaultValue={user.bio ?? ""}
              placeholder="Tell renters what you do…"
              className="rounded-[6px] border-2 border-ink bg-background text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
            Changes apply to future bookings
          </p>
          {state && !state.ok && (
            <p role="alert" className="text-[11px] text-red-600">
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="h-11">
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-4" aria-hidden="true" />
            )}
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </section>
    </form>
  );
}

export function PasswordForm() {
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");

    if (newPassword.length < 8) {
      toast.error("Use at least 8 characters for the new password.");
      return;
    }

    setSaving(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      });
      if (result.error) {
        toast.error("Could not update password", {
          description: result.error.message,
        });
        return;
      }
      toast.success("Password updated");
      event.currentTarget.reset();
    } catch {
      toast.error("Could not update password. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="current-password" className="text-xs font-semibold">
          Current password
        </Label>
        <Input
          id="current-password"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="h-10 rounded-[6px] border-2 border-ink bg-background"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="new-password" className="text-xs font-semibold">
          New password
        </Label>
        <Input
          id="new-password"
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="h-10 rounded-[6px] border-2 border-ink bg-background"
        />
      </div>
      <Button type="submit" variant="outline" disabled={saving} className="h-10">
        {saving ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
