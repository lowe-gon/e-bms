import * as z from 'zod';

export const SectorFormSchema = z.object({
  sectorName: z
    .string({
      error: (iss) =>
        iss.input === undefined ? 'sectorName schema is required' : 'Invalid sectorName Input',
    })
    .min(1, 'Sector Name is Required'),

  purok: z
    .preprocess((val) => {
      if (Array.isArray(val)) {
        return val.join(', ');
      }
      if (typeof val !== 'string') {
        return '';
      }
      return val;
    }, z.string())
    .transform((val) =>
      val
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    )
    .refine((arr) => arr.length > 0, {
      message: 'At least one valid Purok is required',
    }),

  assignedOfficial: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? 'assignedOfficial schema is required'
          : 'Invalid assignedOfficial Input',
    })
    .min(1, 'Assigned Official is Required'),
});

export type SectorFormSchemaProps = z.infer<typeof SectorFormSchema>;
