import {
  ZUpdateAccountFormSchema,
  type TUpdateAccountFormSchema,
} from '@/features/accounts/schemas/account-form.schema';
import { useUpdateUserMutation } from '@/features/users/hooks/use-update-user-mutation';
import useZodForm from '@/hooks/use-zod-form';
import type { TUserWithSector } from '@/typings';
import React from 'react';
import { useWatch, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

type TUseUpdateAccountForm = TUserWithSector & {
  setIsModalOpen: (value: boolean) => void;
};

export default function useUpdateAccountForm({
  clerkId,
  emailAddress,
  firstName,
  lastName,
  phoneNumber,
  avatarUrl,
  role,
  setIsModalOpen,
}: TUseUpdateAccountForm) {
  const form = useZodForm<TUpdateAccountFormSchema>({
    defaultValues: {
      emailAddress: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      image: '',
    },
    schema: ZUpdateAccountFormSchema,
  });

  const { mutateAsync } = useUpdateUserMutation();

  const onSubmitHandler: SubmitHandler<TUpdateAccountFormSchema> = React.useCallback(
    async (data) => {
      try {
        await mutateAsync({ schema: data, userId: clerkId });
        form.reset();
        toast.success(
          `Successfully update user: ${[firstName, lastName].filter(Boolean).join(' ')}`,
        );
        setIsModalOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occured');
      }
    },
    [mutateAsync, form, setIsModalOpen, clerkId, firstName, lastName],
  );

  React.useEffect(() => {
    form.setValues({
      emailAddress: (emailAddress as string) || '',
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      image: avatarUrl || '',
      role: role || '',
    });
  }, [form, emailAddress, role, firstName, lastName, phoneNumber, avatarUrl]);

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
