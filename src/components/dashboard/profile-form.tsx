"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { Camera, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
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
  const [photo, setPhoto] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    undefined,
  );

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.error);
  }, [state]);

  const pickPhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choose a JPG or PNG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("That image is over 2 MB. Pick a smaller one.");
      return;
    }
    setPhoto(URL.createObjectURL(file));
  };

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
        <div className="flex flex-wrap items-center gap-4 p-4">
          <span className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-[10px] border-2 border-ink bg-lime font-mono text-xl font-bold text-primary-foreground">
            {photo ? (
              // A local object URL preview is enough until uploads land.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="size-full object-cover" />
            ) : (
              user.initials
            )}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              onChange={(event) => pickPhoto(event.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="size-4" aria-hidden="true" />
              Change photo
            </Button>
            {photo && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setPhoto(null)}
              >
                <X className="size-4" aria-hidden="true" />
                Remove
              </Button>
            )}
            <p className="w-full font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
              Preview only · hosted image URLs are saved below
            </p>
          </div>
        </div>
        <div className="border-t border-ink/15 px-4 py-3">
          <Label htmlFor="profile-image" className="text-xs font-semibold">
            Hosted image URL
          </Label>
          <Input
            id="profile-image"
            name="image"
            type="url"
            defaultValue={user.image ?? ""}
            placeholder="https://…"
            className="mt-1.5 h-10 rounded-[6px] border-2 border-ink bg-background text-sm"
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
