import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to manage your Yardclub bookings and saved equipment.",
};

export default function LoginPage() {
  return (
    <div>
      <p className="eyebrow">Welcome back</p>
      <h1 className="display-2 mt-2">Pick up where you left off.</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Manage rentals, reopen a saved listing and pick the dates you were
        watching. One account covers renting and listing.
      </p>

      <div className="mt-7">
        <Suspense fallback={<div className="h-48 animate-pulse rounded-[10px] bg-secondary" />}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 border-t border-ink/15 pt-4 font-mono text-[9px] leading-relaxed uppercase tracking-[0.06em] text-ink-soft">
        Protected by Stripe for payments · handover checklist on every rental
      </p>
    </div>
  );
}
