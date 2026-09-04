'use client';

import useGetUsersByRoleInfiniteQuery from '@/features/users/hooks/use-get-users-by-role-infinite-query';
import type { TUsers } from '@/typings';
import React from 'react';

type SectorContextValue = {
  officials: Array<Pick<TUsers, 'avatarUrl' | 'id' | 'firstName' | 'lastName'>>;
  sectors: Array<{
    sectorId: string;
    officialName: string;
    code: string;
    sectorName: string;
    purokCoverage: string[];
  }>;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onLoadMore: () => void;
  hasNextPage: boolean;
};

const SectorContext = React.createContext<SectorContextValue>({
  officials: [],
  sectors: [],
  isError: false,
  isLoading: false,
  isFetching: false,
  hasNextPage: false,
  onLoadMore: () => {},
});

export function SectorProvider({ children }: React.PropsWithChildren) {
  const {
    data: councilors,
    isLoading: isCouncilorLoading,
    isFetching: isCouncilorFetching,
    isError: isCouncilorError,
    hasNextPage: hasNextPageCouncilor,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetUsersByRoleInfiniteQuery('councilor');

  const officials = React.useMemo(
    () =>
      (councilors?.pages[0]?.data?.flatMap((c) => ({
        avatarUrl: c.avatarUrl,
        firstName: c.firstName,
        lastName: c.lastName,
        id: c.id,
      })) as SectorContextValue['officials']) || [],
    [councilors],
  );

  const sectors = React.useMemo(
    () =>
      (councilors?.pages[0]?.data
        ?.filter((c) => c.sectors !== null)
        .flatMap((c) => ({
          officialName: [c.firstName, c.lastName].filter(Boolean).join(' '),
          purokCoverage: c.sectors?.purokCoverage ?? [],
          sectorId: c.sectors?.id ?? '',
          code: c.sectors?.code ?? '',
          sectorName: c.sectors?.name ?? '',
        })) as SectorContextValue['sectors']) || [],
    [councilors],
  );

  const onLoadMore = React.useCallback(async () => {
    if (!hasNextPageCouncilor || isFetchingNextPage) return;
    await fetchNextPage();
  }, [hasNextPageCouncilor, fetchNextPage, isFetchingNextPage]);

  const contextValue: SectorContextValue = React.useMemo(
    () => ({
      officials,
      sectors,
      isLoading: isCouncilorLoading,
      isFetching: isCouncilorFetching,
      isError: isCouncilorError,
      hasNextPage: hasNextPageCouncilor,
      onLoadMore,
    }),
    [
      officials,
      sectors,
      isCouncilorError,
      isCouncilorFetching,
      isCouncilorLoading,
      onLoadMore,
      hasNextPageCouncilor,
    ],
  );

  return <SectorContext.Provider value={contextValue}>{children}</SectorContext.Provider>;
}

export function useSectorContext() {
  const context = React.useContext(SectorContext);
  if (!context) {
    throw new Error('useSectorContext must be used within a SectorProvider');
  }
  return context;
}
