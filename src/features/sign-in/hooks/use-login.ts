import useZodForm from '@/hooks/use-zod-form';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const FormSchema = z.object({
  username: z.string().min(1, 'Username is Required'),
  password: z.string().min(1, 'Password is Required'),
});

export type FormSchemaProps = z.infer<typeof FormSchema>;

export default function useLogin() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();

  const form = useZodForm<FormSchemaProps>({
    defaultValues: {
      username: '',
      password: '',
    },
    schema: FormSchema,
  });

  const onSubmitHandler: SubmitHandler<FormSchemaProps> = React.useCallback(
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

  return { form, onSubmitHandler };
}
