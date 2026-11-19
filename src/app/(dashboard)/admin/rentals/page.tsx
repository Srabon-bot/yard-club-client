import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'All rentals' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="08"
      title='Every booking'
      description='Platform-wide rental ledger with payment status, customer, owner, dates and totals.'
      sections={[
      'Status and payment filters',
      'Search by rental ID or party',
      'Pagination and totals',
      'Detail drawer',
      ]}
      parent={{ label: 'Overview', href: '/admin' }}
    />
  );
}
