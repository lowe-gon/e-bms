/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type FieldValues, type UseFormProps } from 'react-hook-form';
import * as z from 'zod';

type TUseZodFormProps<TFieldValues extends FieldValues> = Omit<
  UseFormProps<TFieldValues>,
  'resolver'
> & {
  schema: z.ZodType<TFieldValues, unknown, any>;
};

export default function useZodForm<T extends FieldValues>({
  schema,
  ...props
}: TUseZodFormProps<T>) {
  const form = useForm<T>({
    ...props,
    resolver: zodResolver(schema),
  });

  return form;
}
