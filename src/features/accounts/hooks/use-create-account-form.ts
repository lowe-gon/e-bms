import {
  ZAccountFormSchema,
  type TAccountFormSchema,
} from '@/features/accounts/schemas/account-form.schema';
import { useCreateUserMution } from '@/features/users/hooks/use-create-user-mutation';
import useZodForm from '@/hooks/use-zod-form';
import React from 'react';
import { useWatch, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

export default function useCreateAccountForm(setIsModalOpen: (value: boolean) => void) {
  const form = useZodForm<TAccountFormSchema>({
    defaultValues: {
      emailAddress: '',
      firstName: '',
      lastName: '',
      password: '',
      username: '',
      phoneNumber: '',
      image: '',
    },
    schema: ZAccountFormSchema,
  });

  const { mutateAsync } = useCreateUserMution();

  const onSubmitHandler: SubmitHandler<TAccountFormSchema> = React.useCallback(
    async (data) => {
      try {
        await mutateAsync(data);
        form.reset();
        toast.success(`Successfully created new user 🎉`);
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occured');
      }
    },
    [mutateAsync, form, setIsModalOpen],
  );

  const firstNameValue = useWatch({
    control: form.control,
    name: 'firstName',
  });
  const lastNameValue = useWatch({
    control: form.control,
    name: 'lastName',
  });
  const roleValue = useWatch({
    control: form.control,
    name: 'role',
  });

  return {
    form,
    onSubmitHandler,
    roleValue,
    fullNameValue: [firstNameValue, lastNameValue].filter(Boolean).join(' '),
  };
}
