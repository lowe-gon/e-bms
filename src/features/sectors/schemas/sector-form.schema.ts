import * as z from 'zod';

export const ZSectorFormSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? 'sectorName schema is required'
          : 'sectorName schema must be string',
    })
    .min(1, 'Sector name is required'),
  purokCoverage: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? 'purokCoverage schema is required'
          : 'purokCoverage schema must be string',
    })
    .min(1, 'Purok coverage is required'),
  assignedCouncilorId: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? 'assignedCouncilorId schema is required'
          : 'assignedCouncilorId schema must be string',
    })
    .min(1, 'Assigned councilor is required'),
});

export type TSectorFormSchema = z.infer<typeof ZSectorFormSchema>;
