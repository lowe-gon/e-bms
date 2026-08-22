'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import React from 'react';

export function FormInput({
  ref,
  id,
  name,
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const inputId = id || name || 'basic-input';
  return (
    <Field>
      <FieldLabel htmlFor={inputId} className="sr-only">
        Basic Input
      </FieldLabel>
      <Input {...props} ref={ref} id={inputId} name={inputId} className={cn('h-12', className)} />
    </Field>
  );
}

export function FormSeachInpu({
  isInvalid,
}: React.ComponentProps<'input'> & {
  isInvalid?: boolean;
}) {
  return <Field data-invalid={isInvalid}></Field>;
}

export function FormInputWithFloatingLabel({
  label,
  isRequired,
  type = 'text',
  placeholder,
  className,
  isInvalid = false,
  value,
  error,
  name,
  id,
  ...props
}: React.ComponentProps<'input'> & {
  label: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  error?: string;
}) {
  const [inputType, setInputType] = React.useState<React.HTMLInputTypeAttribute>(type);
  const [hasValue, setHasValue] = React.useState<boolean>(Boolean(value));

  const inputId = id || name || 'floating-input';

  const onTogglePasswordVisibility = () => {
    setInputType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <Field className="relative w-full" data-invalid={isInvalid}>
      <InputGroup
        className={cn(
          'peer border-input focus-within:border-ring focus-within:ring-ring relative h-12 w-full items-center rounded-md border bg-transparent shadow-xs transition-colors focus-within:ring-1',
          isInvalid &&
            'border-destructive focus-within:border-destructive! focus-within:ring-destructive!',
        )}
        data-filled={hasValue}>
        <InputGroupInput
          {...props}
          id={inputId}
          name={inputId}
          type={inputType}
          placeholder={placeholder || ' '}
          value={value}
          className={cn(
            'text-foreground w-full bg-transparent px-3.5 pt-3 pb-1 text-base outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent md:text-sm',
            type === 'password' && 'pr-10',
            className,
          )}
          onChange={(e) => {
            const newValue = e.target.value;
            setHasValue(newValue.length > 0);
            props.onChange?.(e);
          }}
        />

        {type === 'password' && (
          <InputGroupAddon align="inline-end" className="pr-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={onTogglePasswordVisibility}
              tabIndex={-1}>
              {inputType === 'password' ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>

      <FieldLabel
        aria-invalid={isInvalid}
        htmlFor={inputId}
        className={cn(
          'text-foreground pointer-events-none absolute top-3.5 left-3.5 z-10 origin-left gap-1 text-sm transition-all duration-200',
          'peer-focus-within:text-muted-foreground peer-focus-within:top-1.5 peer-focus-within:text-[10px] peer-focus-within:font-semibold',
          'peer-data-[filled=true]:text-muted-foreground peer-data-[filled=true]:top-1.5 peer-data-[filled=true]:text-[10px] peer-data-[filled=true]:font-semibold',
          isInvalid && 'text-destructive peer-focus-within:text-desctructive',
        )}>
        {label}
        {isRequired && <span className="ml-0.5 text-rose-500">*</span>}
      </FieldLabel>

      {isInvalid && (
        <FieldError
          errors={[{ message: error }]}
          className="flex justify-end text-[10px] font-semibold"
        />
      )}
    </Field>
  );
}

export function FormButton({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Field>
      <Button type="submit" size="lg" {...props} />
    </Field>
  );
}
