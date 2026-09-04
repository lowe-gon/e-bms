import {
  FormFieldCommandOptionInput,
  FormFieldFloatingLabelInput,
} from '@/components/common/form-fields';
import { FieldGroup } from '@/components/ui/field';
import type { TSectorFormSchema } from '@/features/sectors/schemas/sector-form.schema';
import type { TOption } from '@/typings';
import type React from 'react';
import type { Control } from 'react-hook-form';

type THasNextPage =
  | { hasNextPage: true; onLoadMore: () => void }
  | {
      hasNextPage: false;
      onLoadMore?: never;
    };

type TSectorForm = THasNextPage &
  React.ComponentProps<'form'> & {
    control: Control<TSectorFormSchema>;
    options: TOption[];
    onLoadMore?: () => void;
  };

export default function SectorForm({
  control,
  options,
  hasNextPage = false,
  onLoadMore,
  ...props
}: TSectorForm) {
  return (
    <form {...props}>
      <FieldGroup className="grid gap-5 md:grid-cols-2">
        <FormFieldFloatingLabelInput control={control} name="name" label="Sector Name" isRequired />

        <FormFieldFloatingLabelInput
          control={control}
          name="purokCoverage"
          label="Purok Coverage (comma separated)"
          isRequired
        />

        <FormFieldCommandOptionInput
          control={control}
          name="assignedCouncilorId"
          label="Assigned Council / Kagawad Overseer"
          isRequired
          containerClassName="md:col-span-2"
          placeholder="Search for councilor"
          options={options}
          {...(hasNextPage && { hasNextPage, onLoadMore })}
        />
      </FieldGroup>
    </form>
  );
}
