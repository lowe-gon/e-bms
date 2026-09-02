import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { features } from '@/hooks/use-table-features';
import { cn } from '@/lib/utils';
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import {
  flexRender,
  type ColumnDef,
  type ReactTable,
  type Row,
  type RowData,
  type TableState,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface IDataTable<TData extends RowData & { id: string }> {
  table: ReactTable<typeof features, TData, TableState<typeof features>>;
  columns: ColumnDef<typeof features, TData>[];
  isLoading?: boolean;
  onDragEnd: (e: DragEndEvent) => void;
  notFoundText?: string;
}

export function DataTable<TData extends RowData & { id: string }>({
  table,
  notFoundText = 'No result found',
  columns,
  isLoading = false,
  onDragEnd,
}: IDataTable<TData>) {
  return (
    <>
      <Card className="p-0">
        <CardContent className="p-0">
          <DragDropProvider onDragEnd={onDragEnd}>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroups) => (
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
                        }}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {columns.map((_, colIndex) => (
                        <TableCell key={`skeleton-col-${colIndex}`}>
                          <Skeleton className="h-6 w-full rounded-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
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

function DraggableRow<TData extends RowData & { id: string }>({
  row,
}: {
  row: Row<typeof features, TData>;
}) {
  const { ref, isDragging } = useSortable({
    id: row.original.id,
    index: row.index,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={ref}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80">
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            'px-6',
            cell.column.id === 'select' && 'text-center *:[[role=checkbox]]:mx-auto',
          )}
          style={{
            flexGrow: cell.column.getSize(),
            width: cell.column.getSize(),
          }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

function DataTablePagination<TData extends RowData & { id: string }>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50, Infinity],
}: {
  pageSizeOptions?: Array<number>;
  table: ReactTable<typeof features, TData, TableState<typeof features>>;
}): React.ReactNode {
  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
        {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
        {table.getFilteredRowModel().rows.length.toLocaleString()} row(s) selected.
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}>
            <SelectTrigger className="h-8 w-18">
              <SelectValue placeholder={table.state.pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize === Infinity ? 'All' : pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-sm font-medium">
          Page {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
          {table.getPageCount().toLocaleString()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.lastPage()}
            disabled={!table.getCanLastPage()}>
            <ChevronsRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
