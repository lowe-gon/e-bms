'use client';

import { LoadingScreen } from '@/components/common/loading';
import AppHeader from '@/components/layouts/app-header';
import AppSidebar from '@/components/layouts/app-sidebar';
import { SidebarInset, SidebarProvider as SidebarProviderBase } from '@/components/ui/sidebar';
import useGetUserQuery from '@/features/users/hooks/use-get-user-query';
import React from 'react';

export default function SidebarProvider({ children }: React.PropsWithChildren) {
  const { data: user, isFetching: isLoading } = useGetUserQuery();

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SidebarProviderBase
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }>
        <AppSidebar variant="inset" user={user} />
        <SidebarInset>
          <AppHeader />
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProviderBase>
    </>
  );
}
