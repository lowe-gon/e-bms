import CommitteeBanner from '@/features/committees/components/banner';
import CommitteeCarouselWithDetails from '@/features/committees/components/committee-carousel-with-details';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'e-BMS | Committees',
  description:
    'Explore and manage standing committees, their members, and related information within the e-BMS system.',
};

export default function CommitteePage() {
  return (
    <>
      <CommitteeBanner />
      <CommitteeCarouselWithDetails />
    </>
  );
}
