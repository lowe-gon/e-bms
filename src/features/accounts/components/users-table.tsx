'use client';

import { useShallow } from 'zustand/shallow';

import { DataTable } from '@/components/common/data-table';
import DebounceInput from '@/components/common/debounce-input';
import { FacetedFilter } from '@/components/common/faceted-filter';
import useGetUsersQuery from '@/features/users/hooks/use-get-users-query';
import useTable from '@/hooks/use-table';
import { useGlobalUIStore } from '@/store/global-ui.store';

import { columns } from './users-table-columns';

const facetedFilterRole = [
  {
    label: 'Punong Barangay',
    value: 'captain',
  },
  {
    label: 'Sangguniang Barangay',
    value: 'councilor',
  },
  {
    label: 'Barangay Secretary',
    value: 'secretary',
  },
  {
    label: 'Barangay Treasurer',
    value: 'treasurer',
  },
  {
    label: 'Barangay Tanod',
    value: 'tanod',
  },
  {
    label: 'Staff',
    value: 'staff',
  },
];

export default function UsersTable() {
  const { searchQuery, setFiltersSearch, role, setFiltersRole } = useGlobalUIStore(
    useShallow((state) => ({
      searchQuery: state.filters.search,
      setFiltersSearch: state.setFiltersSearch,
      role: state.filters.role,
      setFiltersRole: state.setFiltersRole,
    })),
  );

  const { data: users, isFetching: isLoading } = useGetUsersQuery();

  const { table, onDndDragEnd } = useTable({
    initialData: users?.data ?? [],
    columns,
    pageCount: users?.metadata?.totalPages ?? 0,
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
          <DebounceInput
            value={searchQuery}
            onChange={setFiltersSearch}
            placeholder="Search official by name....."
            className="w-full md:max-w-82"
          />

          <FacetedFilter
            title="Select Role"
            options={facetedFilterRole}
            value={role ? role.split('|') : []}
            multiple
            onValueChange={(value) => {
              setFiltersRole(Array.isArray(value) && value.length > 0 ? value.join('|') : '');
            }}
          />
        </div>
      </div>

      <DataTable table={table} onDragEnd={onDndDragEnd} columns={columns} isLoading={isLoading} />
    </div>
  );
}
