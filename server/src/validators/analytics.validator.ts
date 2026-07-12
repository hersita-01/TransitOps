import { z } from 'zod';

export const dateRangeSchema = {
  query: z.object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }).strict()
  .refine((data) => {
    if (data.from && data.to) {
      return data.from <= data.to;
    }
    return true;
  }, {
    message: '"from" date must not be after "to" date',
    path: ['from'],
  }) as any,
};
