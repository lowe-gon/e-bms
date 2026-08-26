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
import type React from 'react';
import DataTableHeader from './data-table-header';

type DataTableProps<TData extends RowData & { id: string }> = {
  table: ReactTable<typeof features, TData, TableState<typeof features>>;
  renderHeader?: React.ReactNode;
  notFoundText?: string;
  columns: ColumnDef<typeof features, TData>[];

  onDragEnd: (e: DragEndEvent) => void;
};

export default function DataTable<TData extends RowData & { id: string }>({
  table,
  renderHeader,
  notFoundText = 'No result found',
  columns,
  onDragEnd,
}: DataTableProps<TData>) {
  return (
    <>
      <Card className="p-0">
        <CardContent className="p-0">
          {renderHeader}
          <DragDropProvider onDragEnd={onDragEnd}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroups) => (
                  <DataTableHeader key={headerGroups.id} headerGroups={headerGroups} />
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
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
    </>
  );
}
