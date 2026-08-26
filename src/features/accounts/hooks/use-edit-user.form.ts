import {
  EditUserSchema,
  type EditUserSchemaProps,
} from '@/features/accounts/schema/edit-user.schema';
import { type NewUserSchemaProps } from '@/features/accounts/schema/new-user.schema';
import useZodForm from '@/hooks/use-zod-form';
import type { Users } from '@/typings';
import React from 'react';
import { useWatch, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import useUpsertUserMutation from './use-upsert-user-mutation';

export default function useEditUserForm(user: Users) {
  const form = useZodForm<NewUserSchemaProps>({
    defaultValues: {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      phoneNumber: user.phone_number || '',
      role: user.role || '',
      email: user.email_address || '',
    },
    schema: EditUserSchema,
  });

  const { mutateAsync } = useUpsertUserMutation();

  const onSubmitHandler: SubmitHandler<EditUserSchemaProps> = React.useCallback(
    async (data) => {
      try {
        await mutateAsync({
          data,
          mode: 'edit',
          userId: user.clerk_id,
        });
        toast.success('Successfully updated account 🎉');
      } catch (error) {
        console.error(error);
        toast.error(
          `Failed to update account: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`,
        );
      } finally {
        form.reset();
      }
    },
    [mutateAsync, form, user],
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
