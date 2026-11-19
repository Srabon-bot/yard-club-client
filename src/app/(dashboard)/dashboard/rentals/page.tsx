import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'My rentals' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="06"
      title='Every rental, one ledger'
      description='Full rental history with status filters, search, pagination and a printable receipt for each completed booking.'
      sections={[
      'Status tabs with counts',
      'Search and pagination',
      'Rental detail sheet',
      'Printable receipt route',
      ]}
      parent={{ label: 'Overview', href: '/dashboard' }}
    />
  );
}
