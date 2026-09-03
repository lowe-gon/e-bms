import AccountBanner from '@/features/accounts/components/banner';
import UsersTable from '@/features/accounts/components/users-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'e-BMS | Account & Role',
  description:
    'Manage accounts and roles within the e-BMS platform, including user details and permissions.',
};

export default async function AccountsPage() {
  return (
    <>
      <AccountBanner />
      <UsersTable />
    </>
  );
}
