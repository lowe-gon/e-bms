import { Button } from '@/components/ui/button';
import type { features } from '@/hooks/use-table-features';
import { type Column, type RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface DataTableHeaderButtonProps<TData extends RowData & { id: string }> {
  column: Column<typeof features, TData, string>;
  title: string;
}

export default function DataTableHeaderButton<TData extends RowData & { id: string }>({
  column,
  title,
}: DataTableHeaderButtonProps<TData>) {
  const sorted = column.getIsSorted();
  const canSort = column.getCanSort();
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      size="lg"
      className="data-[state=open]:bg-accent -ml-3 h-8 font-bold uppercase"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      <span>{title}</span>
      {canSort && <Icon className="ml-2" />}
    </Button>
  );
}
