"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { GoogleButton } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";
import { authClient } from "@/lib/auth-client";

type Role = Extract<UserRole, "customer" | "owner">;

const ROLES: { value: Role; label: string; note: string }[] = [
  {
    value: "customer",
    label: "Rent gear",
    note: "Book equipment from verified owners.",
  },
  {
    value: "owner",
    label: "List gear",
    note: "Earn from equipment sitting idle.",
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const phone = (formData.get("phone") as string)?.trim();
    const photoUrl = (formData.get("photoUrl") as string)?.trim();
    const password = formData.get("password") as string;
    const terms = formData.get("terms") === "on";

    if (!terms) {
      toast.error("Please agree to the rental terms and handover policy.");
      return;
    }

    // Password validation per Assignment 9 specification:
    // Must have uppercase, lowercase, and minimum 6 characters
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter (A-Z).");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter (a-z).");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoUrl || undefined,
        // @ts-expect-error - Better-auth custom fields
        role,
        phone,
      });

      if (result.error) {
        toast.error("Registration failed", {
          description: result.error.message || "An error occurred while creating your account.",
        });
        setLoading(false);
        return;
      }

      toast.success("Account created successfully!", {
        description:
          role === "owner"
            ? "Welcome to Yardclub. Opening your owner yard dashboard."
            : "Welcome to Yardclub. Opening your customer dashboard.",
      });

      router.push(role === "owner" ? "/owner" : "/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong during sign up.";
      toast.error("Sign up error", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5">
      <div
        role="radiogroup"
        aria-label="Account type"
        className="grid grid-cols-2 gap-2"
      >
        {ROLES.map((option) => {
          const active = role === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRole(option.value)}
              className={cn(
                "rounded-[8px] border-2 border-ink p-3 text-left transition-colors",
                active
                  ? "bg-lime text-[#060605] shadow-offset-sm"
                  : "bg-surface text-ink-soft hover:bg-secondary hover:text-foreground",
              )}
            >
              <span className="font-heading text-sm font-extrabold tracking-[-0.02em]">
                {option.label}
              </span>
              <span
                className={cn(
                  "mt-1 block text-[11px] leading-snug",
                  active ? "text-black/60" : "text-ink-soft",
                )}
              >
                {option.note}
              </span>
            </button>
          );
        })}
      </div>

      <GoogleButton
        label={role === "owner" ? "Continue with Google" : "Sign up with Google"}
      />

      <p className="text-center font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
        Google sign-up defaults to a customer account
      </p>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          or with email
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <form className="grid gap-4" onSubmit={handleRegister}>
        <div className="grid gap-1.5">
          <Label htmlFor="register-name" className="text-xs font-semibold">
            Full name
          </Label>
          <div className="relative">
            <UserRound
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="register-name"
              name="name"
              required
              autoComplete="name"
              placeholder="Tanvir Ahmed"
              className="h-11 rounded-[6px] border-2 border-ink bg-surface pl-9 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="register-email" className="text-xs font-semibold">
            Email
          </Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="register-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@studio.com"
              className="h-11 rounded-[6px] border-2 border-ink bg-surface pl-9 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="register-phone" className="text-xs font-semibold">
            Phone number
          </Label>
          <div className="relative">
            <Phone
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="register-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+880 1711 000 000"
              className="h-11 rounded-[6px] border-2 border-ink bg-surface pl-9 font-mono text-sm"
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="register-photo" className="text-xs font-semibold">
            Photo URL (Optional)
          </Label>
          <div className="relative">
            <ImageIcon
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="register-photo"
              name="photoUrl"
              type="url"
              placeholder="https://i.ibb.co/... or direct image link"
              className="h-11 rounded-[6px] border-2 border-ink bg-surface pl-9 text-sm"
            />
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink-soft">
            Direct link or ImgBB uploaded image URL
          </p>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="register-password" className="text-xs font-semibold">
            Password
          </Label>
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Min 6 chars, uppercase & lowercase"
              className="h-11 rounded-[6px] border-2 border-ink bg-surface pl-9 pr-11 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-[4px] text-ink-soft transition-colors hover:bg-secondary hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-0.5 size-4 shrink-0 accent-[var(--lime)]"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/faq"
              className="font-semibold text-foreground underline decoration-ink/30 decoration-2 underline-offset-2 hover:decoration-ink"
            >
              rental terms
            </Link>{" "}
            and the handover policy.
          </span>
        </label>

        <Button type="submit" disabled={loading} className="h-12 w-full text-base">
          {loading
            ? "Creating account…"
            : role === "owner"
              ? "Create owner account"
              : "Create account"}
          {!loading && <ArrowRight className="size-4" aria-hidden="true" />}
        </Button>
      </form>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground underline decoration-lime decoration-2 underline-offset-4 hover:decoration-ink"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
