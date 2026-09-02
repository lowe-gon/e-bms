'use client';

import { DataTable } from '@/components/common/data-table';
import DebounceInput from '@/components/common/debounce-input';
import useGetUsersQuery from '@/features/users/hooks/use-get-users-query';
import useTable from '@/hooks/use-table';
import { useGlobalUIStore } from '@/store/global-ui.store';
import { useShallow } from 'zustand/shallow';
import { columns } from './users-table-columns';

export default function UsersTable() {
  const { searchQuery, setFiltersSearch } = useGlobalUIStore(
    useShallow((state) => ({
      searchQuery: state.filters.search,
      setFiltersSearch: state.setFiltersSearch,
    })),
  );
  const { data: users, isFetching: isLoading } = useGetUsersQuery();

  const { table, onDndDragEnd } = useTable({
    initialData: users?.data ?? [],
    columns: columns,
    pageCount: users?.metadata?.totalPages ?? 0,
  });

  return (
    <div className="flex flex-col space-y-4">
      <DebounceInput
        value={searchQuery}
        onChange={(value) => setFiltersSearch(value)}
        placeholder="Search official by name....."
        className="max-w-82"
      />
      <DataTable table={table} onDragEnd={onDndDragEnd} columns={columns} isLoading={isLoading} />
    </div>
  );
}
