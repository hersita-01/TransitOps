import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import { USER_ROLES } from '../types/role.types';
import {
  createExpenseSchema,
  updateExpenseSchema,
  getExpenseByIdSchema,
  listExpenseSchema,
} from '../validators/expense.validator';

const router = Router();

// GET / - List all expenses (authenticated)
router.get(
  '/',
  authenticate,
  validate(listExpenseSchema),
  ExpenseController.getExpenses
);

// POST / - Create a new expense (FINANCIAL_ANALYST only)
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.FINANCIAL_ANALYST),
  validate(createExpenseSchema),
  ExpenseController.createExpense
);

// GET /:id - Get expense by ID (authenticated)
router.get(
  '/:id',
  authenticate,
  validate(getExpenseByIdSchema),
  ExpenseController.getExpenseById
);

// PATCH /:id - Update an existing expense (FINANCIAL_ANALYST only)
router.patch(
  '/:id',
  authenticate,
  authorize(USER_ROLES.FINANCIAL_ANALYST),
  validate(getExpenseByIdSchema),
  validate(updateExpenseSchema),
  ExpenseController.updateExpense
);

// DELETE /:id - Delete an expense (FINANCIAL_ANALYST only)
router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.FINANCIAL_ANALYST),
  validate(getExpenseByIdSchema),
  ExpenseController.deleteExpense
);

export default router;
