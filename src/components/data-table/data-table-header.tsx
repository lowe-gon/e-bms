import { TableHead, TableRow } from '@/components/ui/table';
import type { features } from '@/hooks/use-table-features';
import { getCommonPinningStyles } from '@/lib/data-table';
import { cn } from '@/lib/utils';
import { flexRender, type HeaderGroup, type RowData } from '@tanstack/react-table';

interface DataTableHeaderProps<TData extends RowData & { id: string }> {
  headerGroups: HeaderGroup<typeof features, TData>;
}

export default function DataTableHeader<TData extends RowData & { id: string }>({
  headerGroups,
}: DataTableHeaderProps<TData>) {
  return (
    <TableRow key={headerGroups.id}>
      {headerGroups.headers.map((header) => (
        <TableHead
          key={header.id}
          colSpan={header.colSpan}
          className={cn('relative px-6 py-3 font-bold uppercase', {
            'text-center *:[[role=checkbox]]:mx-auto': header.column.id === 'select',
          })}
          style={{
            flexGrow: header.getSize(),
            width: header.getSize(),
            ...getCommonPinningStyles(header.column),
          }}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  );
}
