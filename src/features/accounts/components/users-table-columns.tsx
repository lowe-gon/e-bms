import {
  ActionsCell,
  ContactsCell,
  CredentialsCell,
  FullNameCell,
  RoleAndCommitteeCell,
} from '@/features/accounts/components/user-table-cell-components';
import { features } from '@/hooks/use-table-features';
import type { TUserWithSector } from '@/typings';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<typeof features, TUserWithSector>();

export const columns = columnHelper.columns([
  columnHelper.accessor((row) => [row.firstName, row.lastName].filter(Boolean).join(', '), {
    id: 'fullName',
    header: () => 'Official / Profile',
    cell: ({ row }) => <FullNameCell {...row.original} />,
  }),
  columnHelper.accessor((row) => [row.role, row.sectors?.name].filter(Boolean).join(', '), {
    id: 'roleAndCommittee',
    header: () => 'Role & Committee',
    cell: ({ row }) => <RoleAndCommitteeCell {...row.original} />,
  }),
  columnHelper.accessor('username', {
    header: () => 'Portal Credentials',
    cell: ({ row }) => <CredentialsCell {...row.original} />,
  }),
  columnHelper.accessor((row) => [row.phoneNumber, row.emailAddress].filter(Boolean).join(', '), {
    id: 'contacts',
    header: () => 'Contact',
    cell: ({ row }) => <ContactsCell {...row.original} />,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: () => 'Status',
  }),
  columnHelper.display({
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => <ActionsCell {...row.original} />,
    size: 40,
  }),
]);
