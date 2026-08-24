'use client';

import { FormButton, FormInputWithFloatingLabel } from '@/components/form-fields';
import { FieldGroup } from '@/components/ui/field';
import Link from 'next/link';
import useLogin from '../hooks/use-login';

export default function LoginForm() {
  const { form, onSubmitHandler } = useLogin();

  return (
    <form id="login-form" onSubmit={form.handleSubmit(onSubmitHandler)}>
      <FieldGroup className="gap-3">
        <div className="mb-2 flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your username & password below to login to your account
          </p>
        </div>

        <FormInputWithFloatingLabel
          name="username"
          control={form.control}
          label="Username"
          isRequired
        />

        <FormInputWithFloatingLabel
          type="password"
          name="password"
          control={form.control}
          label="Password"
          isRequired
        />

        <FormButton disabled={form.formState.isSubmitting}>Continue</FormButton>
        <Link href="#" className="mx-auto text-sm underline-offset-4 hover:underline">
          Forgot your password?
        </Link>
      </FieldGroup>
    </form>
  );
}
