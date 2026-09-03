import { useGlobalUIStore } from '@/store/global-ui.store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';
import { getUsers } from '../api/get-users.api';

export default function useGetUsersQuery() {
  const { searchQuery, role, page, limit, sortBy, sortOrder } = useGlobalUIStore(
    useShallow((state) => ({
      searchQuery: state.filters.search,
      role: state.filters.role,
      page: state.pagination.page,
      limit: state.pagination.limit,
      sortBy: state.sorting.sortBy,
      sortOrder: state.sorting.sortOrder,
    })),
  );

  return useQuery({
    queryKey: [
      'users',
      {
        searchQuery,
        role,
        page: page + 1,
        limit,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: async ({ signal }) =>
      await getUsers({
        limit,
        page: page + 1,
        role,
        searchQuery,
        signal,
        sortBy,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
  });
}
