'use client';

import { FormButton, FormInputWithFloatingLabel } from '@/components/form-fields';
import { FieldGroup } from '@/components/ui/field';
import Link from 'next/link';
import useLogin from '../hooks/use-login';

export default function LoginForm() {
  const { form } = useLogin();

  return (
    <form
      id="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <FieldGroup className="gap-3">
        <div className="mb-2 flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your username & password below to login to your account
          </p>
        </div>
        <form.Field name="username">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            const errorMsg = field.state.meta.errors[0]?.message;
            return (
              <FormInputWithFloatingLabel
                id={field.name}
                name={field.name}
                value={(field.state.value as string) ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                isInvalid={isInvalid}
                error={errorMsg}
                label="Username"
                isRequired
              />
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            const errorMsg = field.state.meta.errors[0]?.message;
            return (
              <FormInputWithFloatingLabel
                type="password"
                id={field.name}
                name={field.name}
                value={(field.state.value as string) ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                isInvalid={isInvalid}
                error={errorMsg}
                label="Password"
                isRequired
              />
            );
          }}
        </form.Field>

        <FormButton disabled={form.state.isSubmitting}>Continue</FormButton>
        <Link href="#" className="mx-auto text-sm underline-offset-4 hover:underline">
          Forgot your password?
        </Link>
      </FieldGroup>
    </form>
  );
}
