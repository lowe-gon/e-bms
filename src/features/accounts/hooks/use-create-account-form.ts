import useCreateUserMutation from '@/features/accounts/hooks/use-create-user-mutation';
import { NewUserSchema, type NewUserSchemaProps } from '@/features/accounts/schema/new-user.schema';
import useZodForm from '@/hooks/use-zod-form';
import React from 'react';
import { useWatch, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

export default function useCreateAccountForm() {
  const form = useZodForm<NewUserSchemaProps>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: '',
      username: '',
      password: '',
    },
    schema: NewUserSchema,
  });

  const { mutateAsync } = useCreateUserMutation();

  const onSubmitHandler: SubmitHandler<NewUserSchemaProps> = React.useCallback(
    async (data) => {
      try {
        await mutateAsync(data);
        toast.success('Successfully created account 🎉');
      } catch (error) {
        console.error(error);
        toast.error(
          `Failed to create account: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`,
        );
      } finally {
        form.reset();
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
