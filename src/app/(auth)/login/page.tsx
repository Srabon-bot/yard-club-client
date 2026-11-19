import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Log in' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="05"
      title='Pick up where you left off'
      description='Email and password with Google as the primary path, plus the reset-password link and a route to register.'
      sections={[
      'Google sign-in button',
      'Email and password form with visibility toggle',
      'Inline validation and error state',
      'Forgot-password and register links',
      ]}
      
    />
  );
}
