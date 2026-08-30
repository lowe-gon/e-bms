'use client';

import {
  FormButton,
  FormInputSelectGroup,
  FormInputWithFloatingLabel,
} from '@/components/form-fields';
import { DialogClose } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import useCreateSectorForm from '@/features/sectors/hooks/use-create-sector-form';

interface CreateSectorFormProps {
  officialOptions: Array<{ label: string; value: string; image?: string }>;
  setIsOpenAddAccoutModal: (value: boolean) => void;
}

export default function CreateSectorForm({
  officialOptions,
  setIsOpenAddAccoutModal,
}: CreateSectorFormProps) {
  const { form, onSubmitHandler } = useCreateSectorForm({
    setIsOpenAddAccoutModal,
  });

  return (
    <form
      id="new-sector-form"
      onSubmit={form.handleSubmit(onSubmitHandler)}
      className="space-y-3 pt-2">
      <FieldGroup className="grid gap-3 md:grid-cols-2">
        <FormInputWithFloatingLabel
          control={form.control}
          name="sectorName"
          label="Sector Name"
          placeholder="e.g. Sector 1"
          isRequired
        />
        <FormInputWithFloatingLabel
          control={form.control}
          name="purok"
          label="Purok Coverage (comma separated)"
          placeholder="e.g. Purok 1, Purok 2"
          isRequired
        />

        <FormInputSelectGroup
          control={form.control}
          name="assignedOfficial"
          label="Assigned Council / Kagawad Oversee"
          options={officialOptions}
          isRequired
          containerClassName="md:col-span-2"
          notFoundText="No Official registered yet."
        />
      </FieldGroup>

      <div className="flex items-center justify-end gap-3">
        <DialogClose disabled={form.formState.isSubmitting}>Cancel</DialogClose>
        <div>
          <FormButton disabled={form.formState.isSubmitting}>Save Geographic Sector</FormButton>
        </div>
      </div>
    </form>
  );
}
