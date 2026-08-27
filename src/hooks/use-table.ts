import { features } from '@/hooks/use-table-features';
import { move } from '@dnd-kit/helpers';
import type { DragEndEvent } from '@dnd-kit/react';
import {
  useTable as useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import React from 'react';

export type UseTableProps<TData extends RowData & { id: string }> = {
  initialData: TData[];
  columns: ColumnDef<typeof features, TData>[];
  devtoolKey?: string;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPaginationChange?: (updater: Updater<PaginationState>) => void;
  onDataChange?: (newData: TData[]) => void;
};

export default function useTable<TData extends RowData & { id: string }>({
  initialData,
  columns,
  devtoolKey = 'table-key',
  pageIndex = 0,
  pageSize = 10,
  pageCount = -1,
  onDataChange,
}: UseTableProps<TData>) {
  const [data, setData] = React.useState<TData[]>(initialData);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  });

  const _onPaginationChange = React.useCallback((updater: Updater<PaginationState>) => {
    setPagination((prev) => {
      const nextState = typeof updater === 'function' ? updater(prev) : updater;

      if (nextState.pageSize !== prev.pageSize) {
        return {
          pageIndex: 0,
          pageSize: nextState.pageSize,
        };
      }

      return {
        ...prev,
        pageIndex: nextState.pageIndex,
      };
    });
  }, []);

  const table = useReactTable({
    key: devtoolKey,
    data,
    features,
    columns,
    pageCount,
    manualPagination: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    defaultColumn: {
      size: 120,
      minSize: 60,
      maxSize: 800,
    },
    globalFilterFn: 'includesString',
    getRowId: (row) => row.id,
    enableRowSelection: true,
    columnResizeMode: 'onChange' as const,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: _onPaginationChange,
    onGlobalFilterChange: setGlobalFilter,
  });

  React.useEffect(() => {
    (() => {
      setData(initialData);
    })();
  }, [initialData]);

  const onDndDragEnd = React.useCallback(
    (e: DragEndEvent) => {
      if (e.canceled) return;
      const { source, target } = e.operation;
      if (source && target && source.id !== target.id && onDataChange) {
        onDataChange(move(data, e));
      }
    },
    [onDataChange, data],
  );

  const columnFiltered = React.useCallback(
    (filteredId: string) => {
      return columnFilters.find((col) => col.id === filteredId)?.value as string;
    },
    [columnFilters],
  );

  const onChangeColumnFiltered = React.useCallback(
    (
      e:
        | React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>
        | React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
      filteredId: string,
    ) => {
      const val = e.target.value;
      setColumnFilters((prev) => {
        const next = prev.filter((f) => f.id !== filteredId);
        if (val === 'All' || !val) return next;
        return [...next, { id: filteredId, value: val }];
      });
    },
    [],
  );

  return {
    table,
    columnFilters,
    globalFilter,
    setGlobalFilter,
    setColumnFilters,
    onDndDragEnd,
    columnFiltered,
    onChangeColumnFiltered,
  };
}
