import AppSidebar from '@/components/layouts/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function ProtectedLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SidebarTrigger />
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
