'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { getNavSections } from '@/constants/navigations';
import type { UserRole } from '@/constants/user-role';
import type { TUserWithSector } from '@/typings';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface IAppSidebar extends React.ComponentProps<typeof Sidebar> {
  user: TUserWithSector;
}

export default function AppSidebar({ user, ...props }: IAppSidebar) {
  const pathname = usePathname();
  const navSections = getNavSections((user.role ?? 'captain') as UserRole, user.sectors?.name);

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

      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="pointer-events-none text-[10px] font-black uppercase">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const path = item.id === 'dashboard' ? '/' : `/${item.id}`;
                  const isActive = pathname === path;

                  return (
                    <SidebarMenuItem key={item.id}>
                      <Link href={path}>
                        <SidebarMenuButton
                          isActive={isActive}
                          size="lg"
                          tooltip={item.label}
                          className="cursor-pointer group-data-[collapsible=icon]:p-2! active:bg-blue-500! data-active:bg-blue-600 data-active:text-white data-active:hover:bg-blue-500 data-active:hover:text-white">
                          <Icon className="size-4" />
                          <div className="pointer-events-none grid flex-1 text-left">
                            <div className="truncate leading-tight font-semibold">{item.label}</div>
                            <div className="mt-0.5 truncate text-[10px] leading-tight">
                              {item.description}
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
