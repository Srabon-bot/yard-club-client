"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-[10px] border-2 border-ink bg-surface p-5 shadow-offset-sm">
        <p className="eyebrow">Check your inbox</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          If that email is on Yardclub, a reset link is on its way. The link
          expires in 30 minutes.
        </p>
        <Button asChild variant="outline" className="mt-4 h-11">
          <Link href="/login">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
        toast.success("Reset link sent");
      }}
    >
      <div className="grid gap-1.5">
        <Label htmlFor="reset-email" className="text-xs font-semibold">
          Email
        </Label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <Input
            id="reset-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@studio.com"
            className="h-11 rounded-[6px] border-2 border-ink bg-surface pl-9 text-sm"
          />
        </div>
      </div>
      <Button type="submit" className="h-12 w-full text-base">
        <Send className="size-4" aria-hidden="true" />
        Send reset link
      </Button>
      <Link
        href="/login"
        className="text-center font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft underline decoration-ink/30 decoration-2 underline-offset-4 transition-colors hover:text-foreground hover:decoration-ink"
      >
        Back to sign in
      </Link>
    </form>
  );
}
