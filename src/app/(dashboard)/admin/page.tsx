import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Admin overview' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="08"
      title='The whole platform'
      description='Users, listings, rentals and revenue across Yardclub, with approval queues and category distribution.'
      sections={[
      'Platform stat cards',
      'Revenue and bookings chart',
      'Category distribution',
      'Recent activity table',
      ]}
      parent={{ label: 'Overview', href: '/admin' }}
    />
  );
}
