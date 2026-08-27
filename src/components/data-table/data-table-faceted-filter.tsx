import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronsUpDown } from 'lucide-react';

interface DataTableFacetedFilterProps {
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  title?: string;
  options: { label: string; value: string }[];
}

export default function DataTableFacetedFilter({
  selectedValues,
  onSelectionChange,
  title = '',
  options = [
    { label: 'Captain', value: 'captain' },
    { label: 'Secretary', value: 'secretary' },
    { label: 'Council', value: 'council' },
    { label: 'Treasurer', value: 'treasurer' },
  ],
}: DataTableFacetedFilterProps) {
  const selectedSet = new Set(selectedValues);

  const handleSelect = (value: string) => {
    const nextSet = new Set(selectedSet);
    if (nextSet.has(value)) {
      nextSet.delete(value);
    } else {
      nextSet.add(value);
    }
    onSelectionChange(Array.from(nextSet));
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="h-10 justify-between">
            <span>{selectedSet.size > 0 ? `${selectedSet.size} Selected` : title}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-full max-w-100 p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedSet.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="flex cursor-pointer items-center gap-2">
                    {/* Checkbox circle indicator */}
                    <Checkbox checked={isSelected} className="pointer-events-none" />
                    <span className="capitalize">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
