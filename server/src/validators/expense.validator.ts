import { z } from 'zod';

export const createExpenseSchema = {
  body: z.object({
    vehicleId: z
      .number({ required_error: 'Vehicle ID is required' })
      .int()
      .positive('Vehicle ID must be a positive integer'),
    category: z
      .string({ required_error: 'Category is required' })
      .trim()
      .min(1, 'Category must not be empty'),
    amount: z
      .number({ required_error: 'Amount is required' })
      .finite('Amount must be a finite number')
      .positive('Amount must be greater than zero'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(1, 'Description must not be empty'),
    date: z.coerce.date({ required_error: 'Date is required' }),
  }).strict(),
};

export const updateExpenseSchema = {
  body: z.object({
    vehicleId: z.number().int().positive('Vehicle ID must be a positive integer').optional(),
    category: z.string().trim().min(1, 'Category must not be empty').optional(),
    amount: z.number().finite('Amount must be a finite number').positive('Amount must be greater than zero').optional(),
    description: z.string().trim().min(1, 'Description must not be empty').optional(),
    date: z.coerce.date().optional(),
  }).strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must not be empty',
  }) as any,
};

export const getExpenseByIdSchema = {
  params: z.object({
    id: z.coerce.number().int().positive('Expense ID must be a positive integer'),
  }),
};

export const listExpenseSchema = {
  query: z.object({
    vehicleId: z.coerce.number().int().positive('Vehicle ID must be a positive integer').optional(),
    category: z.string().trim().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }).strict(),
};
