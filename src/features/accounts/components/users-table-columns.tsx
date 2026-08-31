import DataTableHeaderButton from '@/components/data-table/data-table-header-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { features } from '@/hooks/use-table-features';
import type { UserRole, Users } from '@/typings';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Crown, FileText, Mail, Phone, ShieldCheck, Wallet } from 'lucide-react';
import ActionCell from './action-cell';
import { getPermissionsList } from './create-account-form';
import CredentialsCell from './credentials-cell';

const columnHelper = createColumnHelper<typeof features, Users>();

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

export const columns = columnHelper.columns([
  columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
    id: 'officialName',
    header: ({ column }) => <DataTableHeaderButton column={column} title="Official Name" />,
    cell: ({ row }) => {
      const { avatarUrl, firstName, lastName } = row.original;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="ring-muted size-11 rounded-xl ring-2">
            <AvatarImage className="rounded-xl" src={avatarUrl} alt={firstName} />
            <AvatarFallback>
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-bold">
                {firstName} {lastName}
              </span>
            </div>
          </div>
        </div>
      );
    },
  }),

  columnHelper.accessor('role', {
    header: 'Role & Committee',
    cell: ({ row }) => {
      const { role } = row.original;
      return (
        <div className="space-y-1">
          <div>{getRoleBadge(role)}</div>
        </div>
      );
    },
  }),

  columnHelper.accessor('username', {
    header: 'Portal Credentials',
    cell: ({ row }) => <CredentialsCell {...row.original} />,
  }),

  columnHelper.accessor((row) => `${row.phoneNumber} ${row.emailAddress}`, {
    id: 'contacts',
    header: 'Contact',
    cell: ({ row }) => {
      const { emailAddress, phoneNumber } = row.original;

      return (
        <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
          {emailAddress && (
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="truncate">{emailAddress}</span>
            </div>
          )}
          {phoneNumber && (
            <div className="flex items-center gap-1.5 truncate">
              <Phone className="h-3 w-3 shrink-0 text-slate-400" />
              <span>{phoneNumber}</span>
            </div>
          )}
        </div>
      );
    },
  }),

  columnHelper.display({
    id: 'authorized',
    header: 'Authorized Access',
    cell: ({ row }) => {
      const { role } = row.original;
      const permissions = getPermissionsList(role);

      return (
        <div className="flex max-w-55 flex-wrap gap-1">
          {permissions.slice(0, 2).map((perm, idx) => (
            <span
              key={idx}
              className="0 border-border rounded-md border px-2 py-0.5 text-[10px] font-medium">
              {perm}
            </span>
          ))}
          {permissions.length > 2 && (
            <span
              className="text-primary border-primary rounded-md border border-dashed px-1.5 py-0.5 text-[10px] font-semibold"
              title={permissions.slice(2).join(', ')}>
              +{permissions.length - 2} more
            </span>
          )}
        </div>
      );
    },
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) => {
      const { status, lastSignInAt } = row.original;
      return (
        <div className="space-y-0.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {status}
          </span>
          <div className="text-[10px] text-slate-400">
            {lastSignInAt ? format(new Date(lastSignInAt), 'MMM-dd-yyyy') : 'N/A'}
          </div>
        </div>
      );
    },
  }),

  columnHelper.display({
    id: 'action',
    header: 'Actions',
    size: 40,
    cell: ({ row }) => {
      return <ActionCell {...row.original} />;
    },
  }),
]);
