import { UserMeProvider } from '@/features/users/context/user-me.contex';
import SidebarProvider from '@/providers/sidebar-provider';
import React from 'react';

export default function ProtectedLayout({ children }: React.PropsWithChildren) {
  return (
    <UserMeProvider>
      <SidebarProvider>
        <div className="@container/main flex flex-col gap-4 px-3 py-4 md:gap-6 md:py-6">
          {children}
        </div>
      </SidebarProvider>
    </UserMeProvider>
  );
}
