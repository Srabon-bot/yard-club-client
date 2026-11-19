import type { Metadata } from "next";
import { PhasePlaceholder } from "@/components/site/phase-placeholder";

export const metadata: Metadata = { title: 'About' };

export default function Page() {
  return (
    <PhasePlaceholder
      phase="09"
      title='A yard, not a warehouse'
      description='Why Yardclub exists, how owners get verified, and the numbers behind the Dhaka and Chattogram network.'
      sections={[
      'Founding story and operating principles',
      'Owner verification and trust model',
      'Platform numbers and coverage map',
      'Team and contact hand-off',
      ]}
      
    />
  );
}
