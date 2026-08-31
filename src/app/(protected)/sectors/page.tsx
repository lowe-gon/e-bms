import { SectorContextProvider } from '@/context/sectors.context';
import SectorBanner from '@/features/sectors/components/banner';
import HouseholdTable from '@/features/sectors/components/household-table';
import SectorDetails from '@/features/sectors/components/sector-details';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geographic Sector',
  description:
    'Explore the geographic sector details and insights for the barangay, including key information and sector-specific data.',
};

export default function SectorsPage() {
  return (
    <SectorContextProvider>
      <div className="flex flex-col gap-4 px-3 py-4 md:gap-6 md:py-6">
        <SectorBanner />
        <SectorDetails />
        <HouseholdTable />
      </div>
    </SectorContextProvider>
  );
}
