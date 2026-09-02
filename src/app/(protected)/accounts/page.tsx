import AccountBanner from '@/features/accounts/components/banner';
import UsersTable from '@/features/accounts/components/users-table';

export default async function AccountsPage() {
  return (
    <>
      <AccountBanner />
      <UsersTable />
    </>
  );
}
