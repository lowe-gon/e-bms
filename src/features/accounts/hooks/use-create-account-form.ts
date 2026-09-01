import {
  CreateUserFormSchema,
  type CreateUserFormSchemaProps,
} from '@/features/accounts/schema/user-form.scheme';
import { useCreateUserMutation } from '@/hooks/mutations/use-user-mutations';
import useZodForm from '@/hooks/use-zod-form';
import React from 'react';
import { useWatch, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

export default function useCreateAccountForm() {
  const form = useZodForm<CreateUserFormSchemaProps>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: 'captain',
      emailAddress: '',
      username: '',
      password: '',
    },
    schema: CreateUserFormSchema,
  });

  const { mutateAsync } = useCreateUserMutation();

  const onSubmitHandler: SubmitHandler<CreateUserFormSchemaProps> = React.useCallback(
    async (data) => {
      try {
        await mutateAsync(data);
        toast.success('Successfully created account 🎉');
        form.reset();
      } catch (error) {
        console.error(error);
        toast.error(
          `Failed to create account: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`,
        );
      }
    },
    [mutateAsync, form],
  );

  const roleValue = useWatch({
    control: form.control,
    name: 'role',
  });

  const firstNameValue = useWatch({
    control: form.control,
    name: 'firstName',
  });
  const lastNameValue = useWatch({
    control: form.control,
    name: 'lastName',
  });

  return { form, roleValue, fullNameValue: `${firstNameValue} ${lastNameValue}`, onSubmitHandler };
}
