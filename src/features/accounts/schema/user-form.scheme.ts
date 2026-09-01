import * as z from 'zod';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const CreateUserFormSchema = z.object({
  firstName: z
    .string({
      error: (iss) => (iss.input === undefined ? 'firstName schema is required' : 'Invalid schema'),
    })
    .min(1, 'First name is required'),
  lastName: z
    .string({
      error: (iss) => (iss.input === undefined ? 'lastName schema is required' : 'Invalid schema'),
    })
    .min(1, 'Last name is required'),
  emailAddress: z.email('Invalid email address'),
  phoneNumber: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'phoneNumber schema is required' : 'Invalid schema',
    })
    .min(1, 'Phone number is required'),
  username: z
    .string({
      error: (iss) => (iss.input === undefined ? 'username schema is required' : 'Invalid schema'),
    })
    .min(1, 'Username is required'),
  password: z
    .string({
      error: (iss) => (iss.input === undefined ? 'password schema is required' : 'Invalid schema'),
    })
    .min(1, 'Password is required'),
  image: z
    .custom<File>((val) => val instanceof File, 'Please upload a valid file.')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .png, and .webp formats are supported.',
    ),
  role: z.enum(['captain', 'secretary', 'treasurer', 'councilor', 'staff', 'tanod'] as const, {
    error: 'Role must be one of captain, secretary, treasurer, councilor, staff, or tanod',
  }),
});

export const EditUserFormSchema = CreateUserFormSchema.omit({
  password: true,
  username: true,
});

export type EditUserFormSchemaProps = z.infer<typeof EditUserFormSchema>;
export type CreateUserFormSchemaProps = z.infer<typeof CreateUserFormSchema>;
