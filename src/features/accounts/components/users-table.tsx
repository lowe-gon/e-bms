'use client';

import DataTable from '@/components/data-table';
import DebounceInput from '@/components/debounce-input';
import { columns } from '@/features/accounts/components/users-table-columns';
import { useGetAllUsersQuery } from '@/hooks/queries/use-users-queries';
import useTable from '@/hooks/use-table';
import React from 'react';

export default function UsersTable() {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, isFetching: isLoading } = useGetAllUsersQuery({
    searchQuery: searchQuery,
    limit: pageSize,
    page: pageIndex + 1,
  });

  const usersData = data?.data ?? [];
  const totalCount = data?.metadata?.totalPages ?? -1;

  const { table, onDndDragEnd } = useTable({
    devtoolKey: 'table-staff',
    initialData: usersData,
    columns: columns,
    pageSize: pageSize,
    pageIndex: pageIndex,
    pageCount: totalCount,
  });

  React.useEffect(() => {
    (() => {
      setPageIndex(table.state.pagination.pageIndex);
      setPageSize(table.state.pagination.pageSize);
    })();
  }, [table]);

  return (
    <>
      <div className="flex items-center">
        <div className="w-full max-w-100">
          <DebounceInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setPageIndex(0);
            }}
            placeholder="Search official by name, username, etc...."
            debounce={500}
          />
        </div>
      </div>
      <DataTable table={table} columns={columns} onDragEnd={onDndDragEnd} isLoading={isLoading} />
    </>
  );
}
