import * as z from 'zod';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const EditUserSchema = z.object({
  firstName: z.string().min(1, 'First Name is Required'),
  lastName: z.string().min(1, 'Last Name is Required'),
  phoneNumber: z.string().min(1, 'Phone Number is Required'),
  email: z.email('Invalid email'),
  role: z
    .string()
    .refine((value) => ['captain', 'secretary', 'treasurer', 'councilor'].includes(value), {
      message: 'Role must be one of captain, secretary, treasurer, or councilor',
    }),
  image: z
    .custom<File>((val) => val instanceof File, 'Please upload a valid file.')
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB.')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .png, and .webp formats are supported.',
    )
    .optional(),
});

export type EditUserSchemaProps = z.infer<typeof EditUserSchema>;
