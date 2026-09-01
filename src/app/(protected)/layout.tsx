import SidebarProvider from '@/providers/sidebar-provider';
import React from 'react';

export default function ProtectedLayout({ children }: React.PropsWithChildren) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
