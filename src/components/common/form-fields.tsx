'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { base64ToFile, cn, fileToBase64 } from '@/lib/utils';
import { CheckCircle, Eye, EyeOff, RotateCcw, Upload } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

// Floating Label Input
interface IFormFieldFloatingLabelInput<TFieldValues extends FieldValues> extends Omit<
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
}: IFormFieldFloatingLabelInput<TFieldValues>) {
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
                aria-disabled={fieldState.isValidating}
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

// Select Options
interface IFormFieldSelectOptionInput<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<typeof SelectTrigger>,
  'value' | 'onChange' | 'name'
> {
  containerClassName?: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  options: Array<{ label: string; value: string; imageUrl?: string }>;
  isRequired?: boolean;
}
export function FormFieldSelectOptionInput<TFieldValues extends FieldValues>({
  control,
  name,
  containerClassName,
  label,
  options,
  isRequired,
  className,
  ...props
}: IFormFieldSelectOptionInput<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isInvalid = fieldState.invalid;
        const errorMessage = fieldState.error?.message;
        const fieldName = field.name;
        const hasValue = Boolean(field.value);

        return (
          <Field data-invalid={isInvalid} className={cn('relative w-full', containerClassName)}>
            <Select
              items={options}
              value={field.value ?? ''}
              onValueChange={(e) => field.onChange(e)}>
              <SelectTrigger
                aria-invalid={isInvalid}
                data-filled={hasValue}
                className={cn('peer h-12! w-full', className)}

                {...props}>
                <SelectValue
                  ref={field.ref}
                  onBlur={field.onBlur}
                  className={'pt-2'}
                  aria-disabled={fieldState.isValidating}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

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

// File Input
interface IFormFieldPictureInput<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'name'
> {
  containerClassName?: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  isRequired?: boolean;
  fullNameValue?: string;
}
export function FormFieldPictureInput<TFieldValues extends FieldValues>({
  label = 'Picture upload',
  control,
  name,
  containerClassName,
  isRequired,
  fullNameValue,
  ...props
}: IFormFieldPictureInput<TFieldValues>) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isInvalid = fieldState.invalid;
        const errorMessage = fieldState.error?.message;
        const fieldName = field.name;
        const value = field.value;

        return (
          <Field className={cn('relative w-full', containerClassName)}>
            <FieldLabel aria-invalid={isInvalid} htmlFor={fieldName} className="gap-1 text-sm">
              {label}
              {isRequired ? (
                <span className="ml-0.5 text-rose-500">*</span>
              ) : (
                <span className="text-muted-foreground text-[8px] font-semibold">(optional)</span>
              )}
            </FieldLabel>
            <Input
              {...props}
              name={fieldName}
              type="file"
              aria-disabled={fieldState.isValidating}
              className="sr-only"
              accept="image/png, image/jpeg, image/webp, image/gif"
              ref={(e) => {
                field.ref(e);
                inputRef.current = e;
              }}
              onBlur={field.onBlur}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formattedBase64 = await fileToBase64(file);
                field.onChange(formattedBase64);
              }}
            />

            {value ? (
              <div className="border-input dark:bg-input/30 flex items-center gap-3.5 rounded-xl border p-2.5">
                <div className="ring-primary/30 dark:ring-primary-400/30 relative size-14 shrink-0 overflow-hidden rounded-2xl shadow-xs ring-2">
                  <Image src={value} alt="Avatar Preview" className="object-cover" fill />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {fullNameValue || 'New Official Photo'}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" /> Ready
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {value
                      ? value
                      : base64ToFile(value)?.name
                        ? `Uploaded: ${base64ToFile(value)?.name}`
                        : 'Selected Official Avatar'}
                  </p>
                </div>

                {/* Clear / Reset Avatar */}
                <Button
                  type="button"
                  disabled={fieldState.isValidating}
                  variant="destructive"
                  onClick={() => {
                    field.onChange('');
                    if (inputRef.current) {
                      inputRef.current.value = '';
                    }
                  }}
                  title="Reset to default image"
                  className="text-xs font-black">
                  <RotateCcw />
                  <span>Reset</span>
                </Button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDragging(true);
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  const formattedBase64 = await fileToBase64(file);
                  field.onChange(formattedBase64);
                }}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all',
                  isDragging
                    ? 'border-primary bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-border hover:border-accent-foreground dark:hover:bg-primary/20 hover:bg-accent',
                  isInvalid && 'border-destructive',
                )}>
                <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click to browse or drag & drop photo here
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  PNG, JPG, WEBP or GIF up to 5MB
                </p>
              </div>
            )}

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
