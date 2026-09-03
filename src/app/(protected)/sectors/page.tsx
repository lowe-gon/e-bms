import SectorBanner from '@/features/sectors/components/banner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'e-BMS | Geographic Sectors',
  description:
    'Manage and view geographic sectors, assigned councilors, and sector information within the e-BMS system.',
};

export default function SectorsPage() {
  return (
    <>
      <SectorBanner />
    </>
  );
}
