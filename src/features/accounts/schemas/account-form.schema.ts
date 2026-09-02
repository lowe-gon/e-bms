import * as z from 'zod';

export const ZAccountFormSchema = z.object({
  firstName: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? 'firstName schema is required'
          : 'firstName schema must be string',
    })
    .min(1, 'First name is required'),
  lastName: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'lastName schema is required' : 'lastName schema must be string',
    })
    .min(1, 'Last name is required'),
  role: z.enum(['captain', 'secretary', 'treasurer', 'councilor', 'tanod', 'staff'] as const, {
    error: 'Role must be one of captain, secretary, treasurer, councilor, staff, or tanod',
  }),
  emailAddress: z.email('Invalid email address'),
  phoneNumber: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? 'phoneNumber schema is required'
          : 'phoneNumber schema must be string',
    })
    .min(1, 'Phone number is required'),
  image: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'username schema is required' : 'username schema must be string',
    })
    .optional(),
  username: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'username schema is required' : 'username schema must be string',
    })
    .min(1, 'Username is required'),
  password: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'password schema is required' : 'password schema must be string',
    })
    .min(1, 'Password is required')
    .min(15, 'Password must be minimun to 15 characters'),
});
export type TAccountFormSchema = z.infer<typeof ZAccountFormSchema>;

export const ZUpdateAccountFormSchema = ZAccountFormSchema.omit({
  username: true,
  password: true,
});
export type TUpdateAccountFormSchema = z.infer<typeof ZUpdateAccountFormSchema>;
