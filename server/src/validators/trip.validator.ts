import { z } from 'zod';
import { TripStatus } from '../shared/enums/TripStatus';

export const createTripSchema = {
  body: z.object({
    vehicleId: z
      .number({ required_error: 'Vehicle ID is required' })
      .int()
      .positive('Vehicle ID must be a positive integer'),
    driverId: z
      .number({ required_error: 'Driver ID is required' })
      .int()
      .positive('Driver ID must be a positive integer'),
    source: z
      .string({ required_error: 'Source is required' })
      .trim()
      .min(1, 'Source must not be empty'),
    destination: z
      .string({ required_error: 'Destination is required' })
      .trim()
      .min(1, 'Destination must not be empty'),
    cargoWeight: z
      .number({ required_error: 'Cargo weight is required' })
      .finite('Cargo weight must be a finite number')
      .nonnegative('Cargo weight must be zero or greater'),
    plannedDistance: z
      .number({ required_error: 'Planned distance is required' })
      .finite('Planned distance must be a finite number')
      .positive('Planned distance must be greater than zero'),
    startTime: z.coerce.date().optional(),
  }).strict(),
};

export const updateTripSchema = {
  body: createTripSchema.body
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Update body must not be empty',
    }) as any,
};

export const completeTripSchema = {
  body: z.object({
    actualDistance: z
      .number()
      .finite('Actual distance must be a finite number')
      .nonnegative('Actual distance must be zero or greater')
      .optional(),
    fuelUsed: z
      .number()
      .finite('Fuel used must be a finite number')
      .nonnegative('Fuel used must be zero or greater')
      .optional(),
  }).strict(),
};

export const getTripByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive('Trip ID must be a positive integer'),
  }),
};

export const listTripsSchema = {
  query: z.object({
    status: z.nativeEnum(TripStatus, {
      invalid_type_error: 'Invalid trip status',
    }).optional(),
    vehicleId: z.coerce.number().int().positive('Vehicle ID must be a positive integer').optional(),
    driverId: z.coerce.number().int().positive('Driver ID must be a positive integer').optional(),
    search: z.string().trim().optional(),
  }).strict(),
};
