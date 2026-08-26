import { TableCell, TableRow } from '@/components/ui/table';
import type { features } from '@/hooks/use-table-features';
import { getCommonPinningStyles } from '@/lib/data-table';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/react/sortable';
import { flexRender, type Row, type RowData } from '@tanstack/react-table';

interface DraggableTableBodyProps<TData extends RowData & { id: string }> {
  row: Row<typeof features, TData>;
}

export default function DraggableTableBody<TData extends RowData & { id: string }>({
  row,
}: DraggableTableBodyProps<TData>) {
  const { isDragging, ref } = useSortable({
    id: row.original.id,
    index: row.index,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={ref}
      className={cn('relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80')}>
      {row.getAllCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            'px-6',
            cell.column.id === 'select' && 'text-center *:[[role=checkbox]]:mx-auto',
          )}
          style={{
            flexGrow: cell.column.getSize(),
            width: cell.column.getSize(),
            ...getCommonPinningStyles(cell.column, row.getIsSelected()),
          }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
