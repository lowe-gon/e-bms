'use client';

import useGetUserMeQuery from '@/features/users/hooks/use-get-user-me-query';
import type { TUserWithSector } from '@/typings';
import React from 'react';

type UserMeContextValue = {
  user: TUserWithSector | null;
  isLoading: boolean;
  isError: boolean;
};

const UserMeContext = React.createContext<UserMeContextValue>({
  user: null,
  isError: false,
  isLoading: false,
});

export function UserMeProvider({ children }: React.PropsWithChildren) {
  const { data, isLoading, isError } = useGetUserMeQuery();

  const contextValue: UserMeContextValue = React.useMemo(
    () => ({
      user: data?.data || null,
      isError,
      isLoading,
    }),
    [data, isLoading, isError],
  );

  return <UserMeContext.Provider value={contextValue}>{children}</UserMeContext.Provider>;
}

export function useUserMeContext() {
  const context = React.useContext(UserMeContext);
  if (!context) {
    throw new Error('useUserMeContext must be used within a UserMeProvider');
  }
  return context;
}
