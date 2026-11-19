import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'Add equipment' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="07"
      title='List a new machine'
      description='A guided listing form: photos, category, rate, location, quantity, condition and rental terms.'
      sections={[
      'Image upload with previews',
      'Category, rate and availability fields',
      'Validation and error summary',
      'Success state with next steps',
      ]}
      parent={{ label: 'Overview', href: '/owner' }}
    />
  );
}
