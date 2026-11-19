import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a Yardclub account to rent equipment or list your own gear in Dhaka and Chattogram.",
};

export default function RegisterPage() {
  return (
    <div>
      <p className="eyebrow">Create an account</p>
      <h1 className="display-2 mt-2">One account, two modes.</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Rent the excavator this week, list the mixer next month. Choose where
        you want to start; you can add the other side later.
      </p>

      <div className="mt-7">
        <RegisterForm />
      </div>
    </div>
  );
}
