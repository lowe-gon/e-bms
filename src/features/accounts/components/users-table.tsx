'use client';

import DataTable from '@/components/data-table';
import { columns } from '@/features/accounts/components/users-table-columns';
import useGetUsersGetAllQuery from '@/features/accounts/hooks/use-users-get-all-query';
import useTable from '@/hooks/use-table';

export default function UsersTable() {
  const { data, isFetching: isLoading } = useGetUsersGetAllQuery();

  const usersData = data?.pages ? data.pages.flatMap((page) => page.data) : [];

  const { table, onDndDragEnd } = useTable({
    devtoolKey: 'table-staff',
    initialData: usersData,
    columns: columns,
  });

  if (isLoading) return null;

  return (
    <>
      <DataTable table={table} columns={columns} onDragEnd={onDndDragEnd} />
    </>
  );
}
