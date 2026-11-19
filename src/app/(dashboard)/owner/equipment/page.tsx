import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'My equipment' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="07"
      title='Manage the fleet'
      description='Every listing with status, rate, views and booking count, plus edit, pause and delete actions.'
      sections={[
      'Status-filtered equipment table',
      'Inline rate and availability editing',
      'Pause and delete confirmations',
      'Pagination and empty state',
      ]}
      parent={{ label: 'Overview', href: '/owner' }}
    />
  );
}
