import AccountBanner from '@/features/accounts/components/banner';
import UsersTable from '@/features/accounts/components/users-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounts & Role',
  description: '',
};

export default function AccountsPage() {
  return (
    <div className="flex flex-col gap-4 px-3 py-4 md:gap-6 md:py-6">
      <AccountBanner />
      <UsersTable />
    </div>
  );
}
