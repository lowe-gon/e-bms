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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { generateSecurePassword } from '@/lib/generate-password';
import { cn, fileToDataUrl } from '@/lib/utils';
import { CheckCircle, Eye, EyeOff, Sparkle, Upload } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function FormInput<TFieldValues extends FieldValues>({
  ref,
  control,
  name,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'name'> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = fieldState.invalid;
        const inputId = field.name;
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={inputId} className="sr-only">
              Basic Input
            </FieldLabel>
            <Input
              {...props}
              ref={ref}
              id={inputId}
              name={inputId}
              className={cn('h-12', className)}
            />
          </Field>
        );
      }}
    />
  );
}

export function FormSeachInput({
  isInvalid,
}: React.ComponentProps<'input'> & {
  isInvalid?: boolean;
}) {
  return <Field data-invalid={isInvalid}></Field>;
}

export function FormInputFile<TFieldValues extends FieldValues>({
  name,
  control,
  label = 'Picture upload',
  accept = 'image/png, image/jpeg, image/webp, image/gif',
  watchName,
  isRequired,
}: {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  accept?: string;
  watchName?: string;
  maxSizeMB?: number;
  isRequired?: boolean;
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [imageBase64, setImageBase64] = React.useState<string>('');

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, value, onChange, ...field }, fieldState }) => {
        const isInvalid = fieldState.invalid;
        const file = value as File;

        const validateAndSetFile = async (file: File | undefined) => {
          if (!file) return;
          onChange(file);

          const base64 = await fileToDataUrl(file);
          setImageBase64(base64);
        };

        const handleFileChange = async (file: File | undefined) => {
          if (!file) return;
          onChange(file);
          const base64 = await fileToDataUrl(file);
          setImageBase64(base64);
        };

        const handleDragOver = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(true);
        };

        const handleDragLeave = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) {
            validateAndSetFile(file);
          }
        };

        const handleReset = () => {
          onChange(undefined);
          setImageBase64('');
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        };

        return (
          <Field className="relative w-full" data-invalid={isInvalid}>
            <FieldLabel aria-invalid={isInvalid} className="gap-1 text-sm">
              {label}{' '}
              {isRequired ? (
                <span className="ml-0.5 text-rose-500">*</span>
              ) : (
                <span className="text-muted-foreground text-[8px] font-semibold">(optional)</span>
              )}
            </FieldLabel>

            {/* Hidden Native File Input */}
            <Input
              ref={(e) => {
                ref(e);
                inputRef.current = e;
              }}
              type="file"
              accept={accept}
              className="sr-only"
              id={name}
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleFileChange(file);
              }}
              {...field}
            />

            {file && imageBase64 ? (
              <div className="flex items-center gap-3.5 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="ring-primary/30 dark:ring-primary-400/30 relative size-14 shrink-0 overflow-hidden rounded-2xl shadow-xs ring-2">
                  <Image src={imageBase64} alt="Avatar Preview" className="object-cover" fill />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                      {watchName?.trim() || ' New Official Photo'}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" /> Ready
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {file?.name ? `Uploaded: ${file.name}` : 'Selected Official Avatar'}
                  </p>
                </div>

                {/* Clear / Reset Avatar */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  title="Reset to default image"
                  className="text-muted-foreground text-[10px] font-semibold transition-colors hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400">
                  Reset
                </Button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all',
                  isDragging
                    ? 'border-primary bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-300 hover:border-blue-400 hover:bg-white dark:border-slate-700 dark:hover:bg-slate-900',
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
          </Field>
        );
      }}
    />
  );
}

export function FormInputWithFloatingLabel<TFieldValues extends FieldValues>({
  label,
  isRequired,
  type = 'text',
  placeholder,
  className,
  control,
  name,
  hasGeneratePasswordButton,
  containerClassName,
  ...props
}: Omit<React.ComponentProps<typeof Input>, 'name'> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  isRequired?: boolean;
  containerClassName?: string;
  hasGeneratePasswordButton?: boolean;
}) {
  const [inputType, setInputType] = React.useState<React.HTMLInputTypeAttribute>(type);

  const onTogglePasswordVisibility = () => {
    setInputType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const isInvalid = fieldState.invalid;
        const inputId = field.name;
        const hasValue = Boolean(field.value);
        return (
          <Field className={cn('relative w-full', containerClassName)} data-invalid={isInvalid}>
            <InputGroup
              className={cn(
                'peer border-input focus-within:border-ring focus-within:ring-ring relative h-12 w-full items-center rounded-md border bg-transparent shadow-xs transition-colors focus-within:ring-1',
                isInvalid &&
                  'border-destructive focus-within:border-destructive! focus-within:ring-destructive!',
              )}
              data-filled={hasValue}>
              <InputGroupInput
                {...props}
                {...field}
                type={inputType}
                placeholder={placeholder}
                className={cn(
                  'text-foreground w-full bg-transparent px-3.5 pt-3 pb-1 text-base outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium md:text-sm',
                  'placeholder:text-muted-foreground/50 placeholder:opacity-0 peer-data-[filled=true]:placeholder:opacity-100 focus:placeholder:opacity-100',
                  type === 'password' && 'pr-10',
                  className,
                )}
                onChange={(e) => {
                  field.onChange?.(e);
                  props.onChange?.(e);
                }}
              />

              {type === 'password' && field.value && (
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

              {hasGeneratePasswordButton && (
                <InputGroupAddon align="inline-end" className="pr-2">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-primary hover:text-primary/80 text-[10px]"
                          onClick={() => field.onChange(generateSecurePassword())}>
                          <Sparkle className="size-4" />
                          <span className="sr-only">Generate password</span>
                        </Button>
                      }
                    />
                    <TooltipContent>
                      <p>Generate Password</p>
                    </TooltipContent>
                  </Tooltip>
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
                errors={[{ message: fieldState.error?.message ?? '' }]}
                className="flex justify-end text-[10px] font-semibold"
              />
            )}
          </Field>
        );
      }}
    />
  );
}

export function FormInputSelectGroup<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
  isRequired,
  containerClassName,
  notFoundText = 'No options found',
  ...props
}: Omit<React.ComponentProps<typeof Select>, 'name'> & {
  label: string;
  containerClassName?: string;
  options: Array<{
    value: string;
    label: string;
    image?: string;
  }>;
  isRequired?: boolean;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  notFoundText?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isInvalid = fieldState.invalid;
        const hasValue = field.value !== undefined && field.value !== null && field.value !== '';
        return (
          <Field className={cn('relative w-full', containerClassName)} data-invalid={isInvalid}>
            <Select {...props} items={options} {...field} onValueChange={(e) => field.onChange(e)}>
              <SelectTrigger
                aria-invalid={isInvalid}
                data-filled={hasValue}
                className="peer border-input focus-within:border-ring focus-within:ring-ring relative h-12! w-full items-center rounded-md border bg-transparent shadow-xs transition-colors focus-within:ring-1">
                <SelectValue className="px-1 pt-4 pb-1" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.length ? (
                    options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.image && (
                          <Avatar>
                            <AvatarImage src={opt.image} alt={opt.label} />
                            <AvatarFallback>{opt.label.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}

                        <span>{opt.label}</span>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-2">
                      <span className="text-center text-sm font-bold">{notFoundText}</span>
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            <FieldLabel
              aria-invalid={isInvalid}
              htmlFor={field.name}
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
                errors={[{ message: fieldState.error?.message ?? '' }]}
                className="flex justify-end text-[10px] font-semibold"
              />
            )}
          </Field>
        );
      }}
    />
  );
}

export function FormButton({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Field>
      <Button type="submit" size="lg" {...props} />
    </Field>
  );
}
