import { z } from 'zod';

export const createFuelSchema = {
  body: z.object({
    vehicleId: z
      .number({ required_error: 'Vehicle ID is required' })
      .int()
      .positive('Vehicle ID must be a positive integer'),
    liters: z
      .number({ required_error: 'Liters is required' })
      .finite('Liters must be a finite number')
      .positive('Liters must be greater than zero'),
    cost: z
      .number({ required_error: 'Cost is required' })
      .finite('Cost must be a finite number')
      .nonnegative('Cost must be zero or greater'),
    date: z.coerce.date({ required_error: 'Date is required' }),
  }).strict(),
};

export const updateFuelSchema = {
  body: z.object({
    vehicleId: z.number().int().positive('Vehicle ID must be a positive integer').optional(),
    liters: z.number().finite('Liters must be a finite number').positive('Liters must be greater than zero').optional(),
    cost: z.number().finite('Cost must be a finite number').nonnegative('Cost must be zero or greater').optional(),
    date: z.coerce.date().optional(),
  }).strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must not be empty',
  }) as any,
};

export const getFuelByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive('Fuel ID must be a positive integer'),
  }),
};

export const listFuelSchema = {
  query: z.object({
    vehicleId: z.coerce.number().int().positive('Vehicle ID must be a positive integer').optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }).strict(),
};
