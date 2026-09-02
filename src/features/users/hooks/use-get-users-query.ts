import { useGlobalUIStore } from '@/store/global-ui.store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';
import { getUsers } from '../api/get-users.api';

export default function useGetUsersQuery() {
  const { searchQuery, page, limit, sortBy, sortOrder } = useGlobalUIStore(
    useShallow((state) => ({
      searchQuery: state.filters.search,
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
        page,
        limit,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: async ({ signal }) =>
      await getUsers({
        limit,
        page,
        searchQuery,
        signal,
        sortBy,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
  });
}
