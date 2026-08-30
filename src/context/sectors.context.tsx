'use client';

import useGetUserByRoleQuery from '@/hooks/queries/use-get-user-by-role-query';
import { useGetAllSectorsQuery } from '@/hooks/queries/use-sectors-query';
import type { Users } from '@/typings';
import React, { createContext, useContext } from 'react';

export type SectorProps = {
  id: string;
  code: string;
  name: string;
  purokCoverage: string[];
  assignedCouncil: string;
};

export type SectorStateProps = {
  councils: Users[];
  sector: SectorProps[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
};

const SectorContext = createContext<SectorStateProps>({
  councils: [],
  sector: [],
  isError: false,
  isLoading: false,
  errorMessage: '',
});

export function SectorContextProvider({ children }: React.PropsWithChildren) {
  const {
    data: councils,
    isFetching: isUsersLoading,
    isError: isUsersError,
    error: userError,
  } = useGetUserByRoleQuery('councilor');

  const {
    data: sectors,
    isFetching: isSectorLoading,
    isError: isSectorError,
    error: sectorError,
  } = useGetAllSectorsQuery();

  const sectorMapped: SectorProps[] =
    sectors?.data.map(({ first_name, last_name, sector_id, sector }, index) => ({
      assignedCouncil: `${first_name} ${last_name}`,
      code: `SEC-${index + 1}`,
      id: sector_id ?? '',
      name: sector.name,
      purokCoverage: sector.puroks.map((p) => p.name),
    })) ?? [];

  return (
    <SectorContext.Provider
      value={{
        councils: councils?.data ?? [],
        sector: sectorMapped,
        isError: isUsersError || isSectorError,
        isLoading: isUsersLoading || isSectorLoading,
        errorMessage: (userError?.message || sectorError?.message) ?? '',
      }}>
      {children}
    </SectorContext.Provider>
  );
}

export function useSector() {
  const context = useContext(SectorContext);
  if (!context) {
    throw new Error('useSector must be used within SectorContextProvider');
  }
  return context;
}
