import { Sidebar, SidebarHeader } from '@/components/ui/sidebar';
import { ShieldCheck } from 'lucide-react';
import React from 'react';

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-border flex flex-col gap-3 border-b pb-4">
        <div className="flex items-center gap-1.5 px-0.5">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <ShieldCheck className="size-4 text-yellow-300" />
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-xs leading-tight font-black tracking-tight uppercase">
              Brgy. Calunboyan
            </span>
            <span className="truncate text-[10px] leading-tight font-semibold text-blue-600 dark:text-blue-400">
              Santa • Portal
            </span>
          </div>
        </div>
      </SidebarHeader>
    </Sidebar>
  );
}
