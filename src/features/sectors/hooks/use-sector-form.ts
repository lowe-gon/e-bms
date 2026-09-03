import {
  type TSectorFormSchema,
  ZSectorFormSchema,
} from '@/features/sectors/schemas/sector-form.schema';
import useZodForm from '@/hooks/use-zod-form';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

export default function useSectorForm() {
  const form = useZodForm<TSectorFormSchema>({
    schema: ZSectorFormSchema,
  });

  const submitHandler: SubmitHandler<TSectorFormSchema> = React.useCallback(async (data) => {
    toast.message(JSON.stringify(data, null, 2));
  }, []);

  return {
    form,
    submitHandler,
  };
}
