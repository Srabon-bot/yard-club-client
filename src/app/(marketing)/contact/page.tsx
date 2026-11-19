import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Contact' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="09"
      title='Talk to a human'
      description='A working contact form, support hours, the Dhaka office and the fastest route for an active-rental problem.'
      sections={[
      'Validated contact form with topic select',
      'Support hours and response targets',
      'Office address and map block',
      'Emergency path for active rentals',
      ]}
      
    />
  );
}
