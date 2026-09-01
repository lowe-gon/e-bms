import * as z from 'zod';

export const ZSignInFormSchema = z.object({
  username: z
    .string({
      error: (iss) =>
        iss === undefined ? 'username schema is required' : 'username schema must be string',
    })
    .min(1, 'Username is required'),
  password: z
    .string({
      error: (iss) =>
        iss === undefined ? 'password schema is required' : 'password schema must be string',
    })
    .min(1, 'Password is required'),
});

export type TSignInFormSchema = z.infer<typeof ZSignInFormSchema>;
