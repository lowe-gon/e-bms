'use client';

import Modal from '@/components/common/modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRole } from '@/constants/user-role';
import type { TUserWithSector } from '@/typings';
import {
  AtSign,
  Check,
  Copy,
  Crown,
  Edit,
  FileText,
  Mail,
  MoreHorizontal,
  Phone,
  ShieldCheck,
  Trash2,
  Wallet,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import useUpdateAccountForm from '../hooks/use-update-account-form';
import UpdateAccountForm from './update-account-form';

const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case 'captain':
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
          <Crown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          Punong Barangay
        </span>
      );
    case 'secretary':
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
          <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          Barangay Secretary
        </span>
      );
    case 'treasurer':
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
          <Wallet className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          Barangay Treasurer
        </span>
      );
    case 'councilor':
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-900 dark:border-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
          <ShieldCheck className="h-3 w-3 text-purple-600 dark:text-purple-400" />
          Councilor / Kagawad
        </span>
      );

    default:
      return null;
  }
};

export function FullNameCell({ firstName, lastName, avatarUrl }: TUserWithSector) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const avatarFallbackText = [firstName, lastName]
    .filter(Boolean)
    .map((n) => n.charAt(0))
    .join('');
  return (
    <div className="flex items-center gap-2">
      <Avatar className="rounded-md!">
        <AvatarImage className="rounded-md!" src={avatarUrl} alt={fullName} />
        <AvatarFallback>{avatarFallbackText}</AvatarFallback>
      </Avatar>
      <h2 className="text-sm font-semibold">{fullName}</h2>
    </div>
  );
}

export function RoleAndCommitteeCell({ role, sectors }: TUserWithSector) {
  return (
    <div className="space-y-1">
      <div>{getRoleBadge(role)}</div>
      {sectors?.name && (
        <span className="text-purple-900 dark:text-purple-300">{sectors.name}</span>
      )}
    </div>
  );
}

export function ContactsCell({ emailAddress, phoneNumber }: TUserWithSector) {
  return (
    <>
      {emailAddress && (
        <div className="text-muted-foreground flex items-center gap-1 text-[10px] font-semibold">
          <Mail className="size-3" />
          <span className="">{emailAddress}</span>
        </div>
      )}
      {phoneNumber && (
        <div className="text-muted-foreground flex items-center gap-1 text-[10px] font-semibold">
          <Phone className="size-3" />
          <span>{phoneNumber}</span>
        </div>
      )}
    </>
  );
}

export function CredentialsCell({ username, id }: TUserWithSector) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, targetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(targetId);
    toast.success('Copied Username');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const uniqueKey = `table-user-${id}`;
  const isCopied = copiedId === uniqueKey;

  return (
    <div className="border-border bg-accent flex max-w-50 items-center justify-between rounded-lg border p-1">
      <div className="flex min-w-0 items-center gap-1">
        <AtSign className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" />
        <span className="truncate font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
          {username}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => username && copyToClipboard(username, uniqueKey)}
        title="Copy username"
        className="text-muted-foreground hover:text-primary cursor-pointer rounded px-2 py-1 transition-colors">
        {isCopied ? (
          <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Copy className="size-3" />
        )}
      </Button>
    </div>
  );
}

export function ActionsCell(user: TUserWithSector) {
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const { form, fullNameValue, onSubmitHandler, roleValue } = useUpdateAccountForm({
    ...user,
    setIsModalOpen: setIsOpenModal,
  });

  return (
    <>
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsOpenModal(true)}>
                <Edit />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Modal
          open={isOpenModal}
          onOpenChange={setIsOpenModal}
          type="update"
          formId="update-account-form"
          headerTitle="Edit Official Account & Role"
          headerDescription="Assign role level, standing committee, and contact credentials"
          icon={Edit}
          isSubmitting={form.formState.isSubmitting}>
          <UpdateAccountForm
            formId="update-account-form"
            control={form.control}
            fullNameValue={fullNameValue}
            roleValue={roleValue}
            onSubmit={form.handleSubmit(onSubmitHandler)}
          />
        </Modal>
      </div>
    </>
  );
}
