import type { features } from '@/hooks/use-table-features';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<typeof features, Record<string, string>>();

export const columns = columnHelper.columns([
  columnHelper.accessor('householdHead', {
    header: 'Household Head & ID',
  }),
  columnHelper.accessor('streetAndPurok', {
    header: 'Street Address & Purok',
  }),
  columnHelper.accessor('familyMember', {
    header: 'Family Members',
  }),
  columnHelper.accessor('contactNumber', {
    header: 'Contact Number',
  }),
  columnHelper.accessor('tags', {
    header: 'Demographic tags',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
  }),
]);
