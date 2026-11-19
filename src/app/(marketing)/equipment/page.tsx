import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Equipment' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="02"
      title='Browse the yard'
      description='Twenty-four listings across six categories, with server-side search, category and location filters, price sorting and pagination.'
      sections={[
      '3-column card grid with equal-height rows',
      'Search, category, location and sort controls',
      'Pagination with a live result count',
      'Empty and loading states for every filter combination',
      ]}
      
    />
  );
}
