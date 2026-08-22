import { useSignIn } from '@clerk/nextjs';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  username: z
    .string({
      error: (iss) => (iss.input === undefined ? '' : 'Invalid Input'),
    })
    .min(1, 'Username is Required'),

  password: z.string().min(1, 'Password is Required'),
});

export default function useLogin() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { username, password } = value;
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
  });

  return { form };
}
