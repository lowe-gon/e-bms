'use client';

import Modal from '@/components/modal';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import EditUserForm from '@/features/accounts/components/edit-user-form';
import useDeleteUserMutation from '@/features/accounts/hooks/use-delete-user-mutation';
import type { Users } from '@/typings';
import { Edit, MoreHorizontal } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function ActionCell(props: Users) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpenEditModal, setIsOpenEditModal] = React.useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = React.useState<boolean>(false);

  const { mutateAsync } = useDeleteUserMutation();

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setIsOpenEditModal(true);
                  router.push(`${pathname}?edit=${props.id}`);
                }}>
                Edit
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem
                onClick={() => {
                  setIsOpenDeleteModal(true);
                  router.push(`${pathname}?delete=${props.clerk_id}`);
                }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isOpenEditModal && (
        <Modal
          isOpen={isOpenEditModal}
          setIsOpen={() => {
            setIsOpenEditModal(false);
            router.back();
          }}
          hasHeader={true}
          headerTitle="Edit Official Account & Role"
          headerDescription="Assign role level, standing committee, and contact credentials"
          hasIcon={true}
          icon={Edit}>
          <EditUserForm {...props} />
        </Modal>
      )}

      {isOpenDeleteModal && (
        <AlertDialog
          open={isOpenDeleteModal}
          onOpenChange={() => {
            setIsOpenDeleteModal(false);
            router.back();
          }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deactivate and remove{' '}
                <span className="font-bold text-black dark:text-white">
                  {props.first_name} {props.last_name}
                </span>{' '}
                <span className="capitalize">({`Barangay ${props.role}`})</span> from the active
                system roster?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={async () => {
                  mutateAsync(props.clerk_id);
                  router.back();
                }}>
                Yes, I&apos;m sure
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
