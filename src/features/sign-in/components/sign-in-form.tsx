'use client';

import { FormFieldFloatingLabelInput } from '@/components/form-fields';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import useSignIn from '@/features/sign-in/hooks/use-sign-in';
import Link from 'next/link';

export default function SignInForm() {
  const { form, onSubmitHandler } = useSignIn();
  return (
    <form
      id="form-sign-in"
      className="w-full space-y-3"
      onSubmit={form.handleSubmit(onSubmitHandler)}>
      <FieldGroup>
        <FormFieldFloatingLabelInput
          control={form.control}
          name="username"
          label="Username"
          placeholder="e.g. juandelacruz"
          isRequired
          disabled={form.formState.isSubmitting}
        />
        <FormFieldFloatingLabelInput
          control={form.control}
          name="password"
          type="password"
          label="Password"
          isRequired
          disabled={form.formState.isSubmitting}
        />
      </FieldGroup>
      <FieldGroup className="gap-1.5">
        <Button type="submit" className="h-12">
          Log in
        </Button>
        <Link href="/forgot-password" className="text-center hover:underline">
          Forgot password
        </Link>
      </FieldGroup>
    </form>
  );
}
