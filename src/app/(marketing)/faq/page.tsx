import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'FAQ' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="09"
      title='Answers, before you ask'
      description='Rental terms, deposits, damage, cancellations, payouts and account questions, grouped and searchable.'
      sections={[
      'Grouped accordion with anchor links',
      'Search across every answer',
      'Empty-search state',
      'Contact CTA at the end of the page',
      ]}
      
    />
  );
}
