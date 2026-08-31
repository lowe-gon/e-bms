import { EditUserSchema, type EditUserSchemaProps } from '@/features/accounts/schema/user.scheme';
import { useUpdateUserMutation } from '@/hooks/mutations/use-user-mutations';
import useZodForm from '@/hooks/use-zod-form';
import type { Users } from '@/typings';
import React from 'react';
import { useWatch, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

export default function useEditUserForm({
  firstName,
  lastName,
  phoneNumber,
  emailAddress,
  role,
  clerkId,
}: Users) {
  const form = useZodForm<EditUserSchemaProps>({
    defaultValues: {
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      role: role || '',
      emailAddress: emailAddress || '',
    },
    schema: EditUserSchema,
  });

  const { mutateAsync } = useUpdateUserMutation();

  const onSubmitHandler: SubmitHandler<EditUserSchemaProps> = React.useCallback(
    async (data) => {
      try {
        await mutateAsync({
          data,
          userId: clerkId,
        });
        toast.success('Successfully updated account 🎉');
        form.reset();
      } catch (error) {
        console.error(error);
        toast.error(
          `Failed to update account: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`,
        );
      }
    },
    [mutateAsync, form, clerkId],
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
