import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your Yardclub account.",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <p className="eyebrow">Account help</p>
      <h1 className="display-2 mt-2">Reset the password.</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Enter the email on your account and we’ll send a link to set a new
        password. Signed in with Google? Use that instead.
      </p>
      <div className="mt-7">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
