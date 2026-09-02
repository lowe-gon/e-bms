import { features } from '@/hooks/use-table-features';
import { useGlobalUIStore } from '@/store/global-ui.store';
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
import { useShallow } from 'zustand/shallow';

export type UseTableProps<TData extends RowData & { id: string }> = {
  initialData: TData[];
  columns: ColumnDef<typeof features, TData>[];
  devtoolKey?: string;

  pageCount?: number;
};

export default function useTable<TData extends RowData & { id: string }>({
  initialData,
  columns,
  devtoolKey = 'table-key',
  pageCount = -1,
}: UseTableProps<TData>) {
  const [data, setData] = React.useState<TData[]>(initialData);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { pagination, setPaginationPage, setPaginationLimit } = useGlobalUIStore(
    useShallow((state) => ({
      ...state,
    })),
  );

  const _onPaginationChange = React.useCallback(
    (updater: Updater<PaginationState>) => {
      const nextState =
        typeof updater === 'function'
          ? updater({
              pageIndex: pagination.page,
              pageSize: pagination.limit,
            })
          : updater;

      if (nextState.pageSize !== pagination.limit) {
        setPaginationPage(0);
        setPaginationLimit(nextState.pageSize);
        return;
      }

      setPaginationPage(nextState.pageIndex);
      setPaginationLimit(nextState.pageSize);
    },
    [setPaginationLimit, setPaginationPage, pagination],
  );

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
      pagination: {
        pageIndex: pagination.page,
        pageSize: pagination.limit,
      },
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

  const onDndDragEnd = React.useCallback((e: DragEndEvent) => {
    if (e.canceled) return;
    const { source, target } = e.operation;
    if (source && target && source.id !== target.id) {
      setData((prev) => move(prev, e));
    }
  }, []);

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
