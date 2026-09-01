'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface TFormFieldFloatingLabelInput<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<typeof InputGroupInput>,
  'value' | 'onChange' | 'name'
> {
  containerClassName?: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  isRequired?: boolean;
}
export function FormFieldFloatingLabelInput<TFieldValues extends FieldValues>({
  control,
  name,
  containerClassName,
  label,
  isRequired,
  className,
  placeholder,
  type = 'text',
  ...props
}: TFormFieldFloatingLabelInput<TFieldValues>) {
  const [inputType, setInputType] = React.useState<React.HTMLInputTypeAttribute>(type);

  const onTogglePasswordVisibility = () => {
    setInputType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isInvalid = fieldState.invalid;
        const errorMessage = fieldState.error?.message;
        const fieldName = field.name;
        const hasValue = Boolean(field.value);
        console.log(hasValue);
        return (
          <Field data-invalid={isInvalid} className={cn('relative w-full', containerClassName)}>
            <InputGroup
              data-filled={hasValue}
              className={cn(
                'peer border-input h-12 w-full border',
                isInvalid && 'border-destructive',
              )}>
              <InputGroupInput
                {...field}
                {...props}
                type={inputType}
                onChange={(e) => field.onChange(e)}
                placeholder={placeholder}
                className={cn(
                  'placeholder:text-muted-foreground/50 flex-1 pt-3',
                  'placeholder:opacity-0 peer-data-[filled=true]:placeholder:opacity-100 focus:placeholder:opacity-100',
                  className,
                )}
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
              htmlFor={fieldName}
              aria-invalid={isInvalid}
              className={cn(
                'pointer-events-none absolute top-1/2 left-3 z-20 -translate-y-1/2 gap-1 font-medium transition-all duration-300',
                'peer-focus-within:text-muted-foreground peer-focus-within:top-3 peer-focus-within:text-[10px] peer-focus-within:font-semibold',
                'peer-data-[filled=true]:text-muted-foreground peer-data-[filled=true]:top-3 peer-data-[filled=true]:text-[10px] peer-data-[filled=true]:font-semibold',
              )}>
              {label}
              {isRequired && <span className="text-rose-500">*</span>}
            </FieldLabel>

            {isInvalid && (
              <div className="absolute -top-4.5 flex items-end justify-end">
                <FieldError className="text-[10px] font-semibold">{errorMessage}</FieldError>
              </div>
            )}
          </Field>
        );
      }}
    />
  );
}
