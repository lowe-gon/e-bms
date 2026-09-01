import {
  type TSignInFormSchema,
  ZSignInFormSchema,
} from '@/features/sign-in/schemas/sign-in-form.schema';
import useZodForm from '@/hooks/use-zod-form';
import { useSignIn as useClerkSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

export default function useSignIn() {
  const router = useRouter();
  const { signIn, fetchStatus } = useClerkSignIn();
  const form = useZodForm<TSignInFormSchema>({
    defaultValues: {
      username: '',
      password: '',
    },
    schema: ZSignInFormSchema,
  });

  const onSubmitHandler: SubmitHandler<TSignInFormSchema> = React.useCallback(
    async (data) => {
      const { username, password } = data;
      if (fetchStatus === 'fetching' || !signIn) return;

      const { error: signInError } = await signIn.create({
        identifier: username,
        password,
      });

      if (signInError) {
        toast.error(signInError.message || 'Authentication failed');
        return;
      }
      const finalizeRes = await signIn?.finalize({
        navigate: () => router.push('/'),
      });

      if (finalizeRes?.error) {
        toast.error(finalizeRes.error.message || 'Finalization failed');
        return;
      }
    },
    [fetchStatus, router, signIn],
  );

  return {
    form,
    onSubmitHandler,
  };
}
