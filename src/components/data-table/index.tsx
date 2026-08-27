import DraggableTableBody from '@/components/data-table/draggable-table-body';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import type { features } from '@/hooks/use-table-features';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import {
  type ColumnDef,
  type ReactTable,
  type RowData,
  type TableState,
} from '@tanstack/react-table';
import { Skeleton } from '../ui/skeleton';
import DataTableHeader from './data-table-header';
import { DataTablePagination } from './data-table.pagination';

type DataTableProps<TData extends RowData & { id: string }> = {
  table: ReactTable<typeof features, TData, TableState<typeof features>>;
  notFoundText?: string;
  columns: ColumnDef<typeof features, TData>[];
  isLoading?: boolean;
  onDragEnd: (e: DragEndEvent) => void;
};

export default function DataTable<TData extends RowData & { id: string }>({
  table,
  notFoundText = 'No result found',
  columns,
  isLoading = false,
  onDragEnd,
}: DataTableProps<TData>) {
  return (
    <>
      <Card className="p-0">
        <CardContent className="p-0">
          <DragDropProvider onDragEnd={onDragEnd}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroups) => (
                  <DataTableHeader key={headerGroups.id} headerGroups={headerGroups} />
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={`skeleton-col-${colIndex}`}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length > 0 ? (
                  table
                    .getRowModel()
                    .rows.map((row) => <DraggableTableBody key={row.id} row={row} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {notFoundText}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DragDropProvider>
        </CardContent>
      </Card>

      <DataTablePagination table={table} />
    </>
  );
}
