'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { getNavSections } from '@/constants/navigations';
import type { UserRole } from '@/constants/user-role';
import type { TUserWithSector } from '@/typings';
import { useClerk } from '@clerk/nextjs';
import { ChevronsUpDown, LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface IAppSidebar extends React.ComponentProps<typeof Sidebar> {
  user: TUserWithSector;
}

export default function AppSidebar({ user, ...props }: IAppSidebar) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { signOut } = useClerk();

  const [showLogoutDialog, setShowLogoutDialog] = React.useState<boolean>(false);

  const navSections = getNavSections((user.role ?? 'captain') as UserRole, user.sectors?.name);

  return (
    <>
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
                              <div className="truncate leading-tight font-semibold">
                                {item.label}
                              </div>
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
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={user.avatarUrl ?? ''}
                          alt={user.firstName}
                          className="rounded-lg"
                        />
                        <AvatarFallback className="rounded-lg">
                          {user?.firstName.charAt(0)}
                          {user?.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="truncate text-xs font-bold capitalize">{user?.role}</span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  }
                />

                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="size-8 rounded-lg!">
                          <AvatarImage
                            src={user?.avatarUrl ?? ''}
                            alt={user?.firstName}
                            className="rounded-lg"
                          />
                          <AvatarFallback className="rounded-lg">
                            {user?.firstName.charAt(0)}
                            {user?.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {user?.firstName} {user?.lastName}
                          </span>
                          <span className="truncate text-xs font-bold capitalize">
                            {user?.role ?? ''}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setShowLogoutDialog(true)}
                      className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Logout Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to access your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => signOut({ redirectUrl: '/sign-in' })}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
