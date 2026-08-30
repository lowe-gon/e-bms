import useCreateSectorMutation from '@/features/sectors/hooks/use-create-sector-mutation';
import {
  SectorFormSchema,
  type SectorFormSchemaProps,
} from '@/features/sectors/schema/sector-form.schema';
import useZodForm from '@/hooks/use-zod-form';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

export default function useCreateSectorForm({
  setIsOpenAddAccoutModal,
}: {
  setIsOpenAddAccoutModal: (value: boolean) => void;
}) {
  const form = useZodForm<SectorFormSchemaProps>({
    defaultValues: {
      assignedOfficial: '',
      purok: [''],
      sectorName: '',
    },
    schema: SectorFormSchema,
  });

  const { mutateAsync } = useCreateSectorMutation();

  const onSubmitHandler: SubmitHandler<SectorFormSchemaProps> = React.useCallback(
    async (data) => {
      try {
        mutateAsync(data);
        toast.success('Successfully create sector');
        form.reset();
        setIsOpenAddAccoutModal(false);
      } catch (error) {
        toast.error(`Failed to create sector: ${error}`);
      }
    },
    [mutateAsync, form, setIsOpenAddAccoutModal],
  );

  return { form, onSubmitHandler };
}
