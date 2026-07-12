import { z } from 'zod';
import { VehicleStatus } from '../shared/enums/VehicleStatus';

export const createVehicleSchema = {
  body: z.object({
    registrationNumber: z
      .string({ required_error: 'Registration number is required' })
      .trim()
      .min(1, 'Registration number must not be empty'),
    model: z
      .string({ required_error: 'Model is required' })
      .trim()
      .min(1, 'Model must not be empty'),
    type: z
      .string({ required_error: 'Type is required' })
      .trim()
      .min(1, 'Type must not be empty'),
    capacity: z
      .number({ required_error: 'Capacity is required' })
      .int('Capacity must be an integer')
      .positive('Capacity must be greater than zero'),
    odometer: z
      .number({ required_error: 'Odometer is required' })
      .int('Odometer must be an integer')
      .nonnegative('Odometer cannot be negative'),
    acquisitionCost: z
      .number({ required_error: 'Acquisition cost is required' })
      .nonnegative('Acquisition cost cannot be negative'),
    status: z.nativeEnum(VehicleStatus, {
      required_error: 'Status is required',
      invalid_type_error: 'Invalid vehicle status',
    }),
  }).strict(),
};

export const updateVehicleSchema = {
  body: createVehicleSchema.body
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Update body must not be empty',
    }) as any,
};

export const getVehicleByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive('Vehicle ID must be a positive integer'),
  }),
};

export const listVehiclesSchema = {
  query: z.object({
    status: z.nativeEnum(VehicleStatus, {
      invalid_type_error: 'Invalid vehicle status',
    }).optional(),
    type: z.string().trim().optional(),
    search: z.string().trim().optional(),
  }).strict(),
};

