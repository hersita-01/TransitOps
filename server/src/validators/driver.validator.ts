import { z } from 'zod';
import { DriverStatus } from '../shared/enums/DriverStatus';

export const createDriverSchema = {
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name must not be empty'),
    licenseNumber: z
      .string({ required_error: 'License number is required' })
      .trim()
      .min(1, 'License number must not be empty'),
    category: z
      .string({ required_error: 'Category is required' })
      .trim()
      .min(1, 'Category must not be empty'),
    expiryDate: z.coerce.date({
      required_error: 'Expiry date is required',
      invalid_type_error: 'Invalid expiry date format',
    }),
    contact: z
      .string({ required_error: 'Contact is required' })
      .trim()
      .min(1, 'Contact must not be empty'),
    safetyScore: z
      .number({ required_error: 'Safety score is required' })
      .finite('Safety score must be a finite number')
      .min(0, 'Safety score cannot be negative')
      .max(100, 'Safety score cannot exceed 100'),
    status: z.nativeEnum(DriverStatus, {
      required_error: 'Status is required',
      invalid_type_error: 'Invalid driver status',
    }),
  }).strict(),
};

export const updateDriverSchema = {
  body: createDriverSchema.body
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Update body must not be empty',
    }) as any,
};

export const getDriverByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive('Driver ID must be a positive integer'),
  }),
};

export const listDriversSchema = {
  query: z.object({
    status: z.nativeEnum(DriverStatus, {
      invalid_type_error: 'Invalid driver status',
    }).optional(),
    category: z.string().trim().optional(),
    search: z.string().trim().optional(),
  }).strict(),
};
