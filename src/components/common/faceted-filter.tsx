'use client';

import { Check, PlusCircle, XCircle } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { TOption } from '@/typings';

type BaseProps = {
  title?: string;
  options: TOption[];
};

type SingleSelectProps = BaseProps & {
  multiple?: false;
  value?: string;
  onValueChange: (value: string | undefined) => void;
};

type MultiSelectProps = BaseProps & {
  multiple: true;
  value?: string[];
  onValueChange: (value: string[] | undefined) => void;
};

type FacetedFilterProps = SingleSelectProps | MultiSelectProps;

export function FacetedFilter(props: FacetedFilterProps) {
  const { title, options } = props;
  const [open, setOpen] = React.useState(false);

  const selectedValues = React.useMemo(() => {
    if (Array.isArray(props.value)) {
      return new Set(props.value);
    }

    return props.value ? new Set([props.value]) : new Set<string>();
  }, [props.value]);

  const isMultiple = props.multiple === true;

  const handleItemSelect = React.useCallback(
    (option: TOption) => {
      const isSelected = selectedValues.has(option.value);

      if (isMultiple) {
        const newSelectedValues = new Set(selectedValues);

        if (isSelected) {
          newSelectedValues.delete(option.value);
        } else {
          newSelectedValues.add(option.value);
        }

        const values = Array.from(newSelectedValues);

        props.onValueChange(values.length > 0 ? values : undefined);
        return;
      }

      props.onValueChange(isSelected ? undefined : option.value);
      setOpen(false);
    },
    [isMultiple, props, selectedValues],
  );

  const handleReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      props.onValueChange(undefined);
    },
    [props],
  );

  const selectedCount = selectedValues.size;
  const hasSelection = selectedCount > 0;

  const selectedOptions = options.filter((option) => selectedValues.has(option.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="h-10 border-dashed font-normal">
            {hasSelection ? (
              <div
                role="button"
                aria-label={`Clear ${title ?? 'filter'}`}
                tabIndex={0}
                className="focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none"
                onClick={handleReset}>
                <XCircle />
              </div>
            ) : (
              <PlusCircle />
            )}

            {title}

            {hasSelection && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-0.5 data-[orientation=vertical]:h-full"
                />

                {/* Mobile */}
                <Badge variant="secondary" className="rounded-sm p-3 font-normal lg:hidden">
                  {selectedCount}
                </Badge>

                {/* Desktop */}
                <div className="hidden items-center gap-1 lg:flex">
                  {selectedCount > 2 ? (
                    <Badge variant="secondary" className="rounded-sm p-3 font-normal">
                      {selectedCount} selected
                    </Badge>
                  ) : (
                    selectedOptions.map((option) => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="rounded-sm p-3 font-normal">
                        {option.label}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </Button>
        }
      />

      <PopoverContent className="w-50 p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />

          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup className="max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto">
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    className="[&>svg:last-child]:hidden"
                    onSelect={() => handleItemSelect(option)}>
                    <div
                      className={cn(
                        'border-muted-foreground flex size-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}>
                      <Check />
                    </div>

                    {option.icon && <option.icon />}

                    <span className="truncate">{option.label}</span>

                    {option.count !== undefined && (
                      <span className="ml-auto font-mono text-xs">{option.count}</span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {hasSelection && (
              <>
                <CommandSeparator />

                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleReset()}
                    className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
