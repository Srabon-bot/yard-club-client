import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Owner profile' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="07"
      title='Your public shopfront'
      description='The profile renters see: bio, response time, verification badge, payout details and notification settings.'
      sections={[
      'Public profile fields and preview',
      'Verification status panel',
      'Payout method placeholder',
      'Notification preferences',
      ]}
      parent={{ label: 'Overview', href: '/owner' }}
    />
  );
}
