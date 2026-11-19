import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Create an account' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="05"
      title='One account, two modes'
      description='Register as a customer or request an owner account. Google sign-up defaults to Customer, per the brief.'
      sections={[
      'Role choice with customer default',
      'Name, email and password fields',
      'Terms checkbox and validation',
      'Google sign-up path',
      ]}
      
    />
  );
}
