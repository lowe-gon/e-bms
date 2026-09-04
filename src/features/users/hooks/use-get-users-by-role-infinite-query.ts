import type { UserRole } from '@/constants/user-role';
import { getUserByRole } from '@/features/users/api/get-user-by-role';
import { useGlobalUIStore } from '@/store/global-ui.store';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/shallow';

export default function useGetUsersByRoleInfiniteQuery(role: UserRole) {
  const { searchQuery, limit, sortOrder } = useGlobalUIStore(
    useShallow((state) => ({
      searchQuery: state.filters.search,
      limit: state.pagination.limit,
      sortOrder: state.sorting.sortOrder,
    })),
  );

  return useInfiniteQuery({
    queryKey: [
      'councilors',
      {
        searchQuery,
        limit,
        sortOrder,
        role,
      },
    ],
    queryFn: async ({ signal, pageParam = 1 }) =>
      await getUserByRole({ signal, role, limit, page: pageParam, searchQuery, sortOrder }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata ?? {};

      if (page === undefined || totalPages === undefined) {
        return undefined;
      }

      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
}
