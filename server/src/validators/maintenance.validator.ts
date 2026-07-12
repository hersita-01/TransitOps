import { z } from 'zod';
import { MaintenanceStatus } from '../shared/enums/MaintenanceStatus';

export const createMaintenanceSchema = {
  body: z.object({
    vehicleId: z
      .number({ required_error: 'Vehicle ID is required' })
      .int()
      .positive('Vehicle ID must be a positive integer'),
    serviceType: z
      .string({ required_error: 'Service type is required' })
      .trim()
      .min(1, 'Service type must not be empty'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(1, 'Description must not be empty'),
    cost: z
      .number({ required_error: 'Cost is required' })
      .finite('Cost must be a finite number')
      .nonnegative('Cost must be zero or greater'),
    startDate: z.coerce.date({ required_error: 'Start date is required' }),
    endDate: z.coerce.date().optional(),
  }).strict()
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'End date must not be before start date',
    path: ['endDate'],
  }) as any,
};

export const updateMaintenanceSchema = {
  body: z.object({
    serviceType: z.string().trim().min(1, 'Service type must not be empty').optional(),
    description: z.string().trim().min(1, 'Description must not be empty').optional(),
    cost: z.number().finite('Cost must be a finite number').nonnegative('Cost must be zero or greater').optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }).strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must not be empty',
  })
  .refine((data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true; // We can't fully validate against existing dates here without DB context, but we validate if both are provided.
  }, {
    message: 'End date must not be before start date',
    path: ['endDate'],
  }) as any,
};

export const closeMaintenanceSchema = {
  body: z.object({
    endDate: z.coerce.date({ required_error: 'End date is required for closing' }),
  }).strict(),
};

export const getMaintenanceByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive('Maintenance ID must be a positive integer'),
  }),
};

export const listMaintenanceSchema = {
  query: z.object({
    status: z.nativeEnum(MaintenanceStatus, {
      invalid_type_error: 'Invalid maintenance status',
    }).optional(),
    vehicleId: z.coerce.number().int().positive('Vehicle ID must be a positive integer').optional(),
    serviceType: z.string().trim().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }).strict(),
};
