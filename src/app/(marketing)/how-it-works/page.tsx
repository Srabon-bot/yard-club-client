import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'How it works' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="04"
      title='From browse to handover'
      description='The five-step rental loop, explained without marketing fog: find gear, check dates, book, inspect, return.'
      sections={[
      'Five-step timeline with owner and renter views',
      'Fee, deposit and cancellation explainer',
      'Trust and damage-protection panels',
      'FAQ hand-off into the support page',
      ]}
      
    />
  );
}
