import useCreateSectorMutation from '@/features/sectors/hooks/use-create-sector-mutation';
import useUpdateSectorMutation from '@/features/sectors/hooks/use-update-sector-mutation';
import {
  type TSectorFormSchema,
  ZSectorFormSchema,
} from '@/features/sectors/schemas/sector-form.schema';
import useZodForm from '@/hooks/use-zod-form';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

type UseSectorForm = {
  councilId?: string;
  name?: string;
  purokCoverage?: string;
  sectorId?: string;
  mode: 'create' | 'update';
  onCloseModal: () => void;
};

export default function useSectorForm(sector: UseSectorForm) {
  const form = useZodForm<TSectorFormSchema>({
    defaultValues: {
      assignedCouncilorId: '',
      name: '',
      purokCoverage: '',
    },
    schema: ZSectorFormSchema,
  });

  const { mutateAsync: createSectorMutateAsync } = useCreateSectorMutation();
  const { mutateAsync: updateSectorMutateAsync } = useUpdateSectorMutation();

  const onSubmitHandler: SubmitHandler<TSectorFormSchema> = React.useCallback(
    async (data) => {
      try {
        if (sector.mode === 'create') {
          await createSectorMutateAsync(data);
          toast.success('Successfully create sector 🎉');
          sector.onCloseModal();
          return;
        }
        await updateSectorMutateAsync({
          schema: data,
          sectorId: sector.sectorId!,
        });
        toast.success('Successfully update sector 🎉');
        sector.onCloseModal();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occured');
      }
    },
    [createSectorMutateAsync, updateSectorMutateAsync, sector],
  );

  React.useEffect(() => {
    const { councilId, name, purokCoverage } = sector;
    console.log(councilId);
    form.setValues({
      assignedCouncilorId: councilId || '',
      name: name || '',
      purokCoverage: purokCoverage || '',
    });
  }, [sector, form]);

  return {
    form,
    onSubmitHandler,
  };
}
