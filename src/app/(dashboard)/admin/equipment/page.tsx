import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'All equipment' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="08"
      title='The approval queue'
      description='Every listing on the platform, with pending approvals surfaced first and owner attribution on each row.'
      sections={[
      'Pending approval queue',
      'Approve and reject actions',
      'Category and status filters',
      'Owner and rate columns',
      ]}
      parent={{ label: 'Overview', href: '/admin' }}
    />
  );
}
