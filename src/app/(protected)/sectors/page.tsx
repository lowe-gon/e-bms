import SectorBanner from '@/features/sectors/components/banner';
import SectorCarouselWithDetail from '@/features/sectors/components/sector-carousel-with-detail';
import { SectorProvider } from '@/features/sectors/context/sectors.context';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'e-BMS | Geographic Sectors',
  description:
    'Manage and view geographic sectors, assigned councilors, and sector information within the e-BMS system.',
};

export default function SectorsPage() {
  return (
    <>
      <SectorProvider>
        <SectorBanner />
        <SectorCarouselWithDetail />
      </SectorProvider>
    </>
  );
}
