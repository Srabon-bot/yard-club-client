"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.28a12 12 0 0 0 0 10.74l4.01-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.28 6.63l4.01 3.09C6.23 6.88 8.88 4.77 12 4.77Z"
      />
    </svg>
  );
}

export function GoogleButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        toast.success("Signed in with Google", {
          description: "Continuing to the customer dashboard.",
        });
        router.push("/dashboard");
      }}
      className="h-12 w-full border-2 border-ink bg-surface text-sm font-semibold"
    >
      <GoogleMark className="size-4" />
      {label}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;
    const rememberMe = formData.get("remember") === "on";

    if (!email || !password) {
      toast.error("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (result.error) {
        toast.error("Sign in failed", {
          description:
            result.error.message || "Invalid credentials. Please verify your email and password.",
        });
        setLoading(false);
        return;
      }

      const user = result.data?.user as
        | { role?: string; name?: string }
        | undefined;
      const role = user?.role || "customer";

      toast.success("Welcome back!", {
        description: `Signed in as ${user?.name || email}.`,
      });

      // Redirect to nextUrl if requested, otherwise navigate to role-specific dashboard
      if (nextUrl) {
        router.push(nextUrl);
      } else if (role === "admin") {
        router.push("/admin");
      } else if (role === "owner") {
        router.push("/owner");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong during sign in.";
      toast.error("Sign in error", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5">
      <GoogleButton label="Continue with Google" />

      <p className="text-center font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
        Google creates a customer account by default
      </p>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-ink/15" />
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
          or with email
        </span>
        <span className="h-px flex-1 bg-ink/15" />
      </div>

      <form className="grid gap-4" onSubmit={handleLogin}>
        <div className="grid gap-1.5">
          <Label htmlFor="login-email" className="text-xs font-semibold">
            Email
          </Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="login-email"
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
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="login-password" className="text-xs font-semibold">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:text-foreground hover:decoration-ink"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <LockKeyhole
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
              aria-hidden="true"
            />
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Your password"
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

        <label className="flex items-center gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="remember"
            defaultChecked
            className="size-4 accent-[var(--lime)]"
          />
          Keep me signed in on this device
        </label>

        <Button type="submit" disabled={loading} className="h-12 w-full text-base">
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight className="size-4" aria-hidden="true" />}
        </Button>
      </form>

      <p className="text-center text-sm text-ink-soft">
        New to Yardclub?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground underline decoration-lime decoration-2 underline-offset-4 hover:decoration-ink"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
