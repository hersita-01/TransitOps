import { Router } from 'express';
import { FuelController } from '../controllers/fuel.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import { USER_ROLES } from '../types/role.types';
import {
  createFuelSchema,
  updateFuelSchema,
  getFuelByIdSchema,
  listFuelSchema,
} from '../validators/fuel.validator';

const router = Router();

// GET / - List all fuel logs (authenticated)
router.get(
  '/',
  authenticate,
  validate(listFuelSchema),
  FuelController.getFuelLogs
);

// POST / - Create a new fuel log (FINANCIAL_ANALYST only)
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.FINANCIAL_ANALYST),
  validate(createFuelSchema),
  FuelController.createFuelLog
);

// GET /:id - Get fuel log by ID (authenticated)
router.get(
  '/:id',
  authenticate,
  validate(getFuelByIdSchema),
  FuelController.getFuelLogById
);

// PATCH /:id - Update an existing fuel log (FINANCIAL_ANALYST only)
router.patch(
  '/:id',
  authenticate,
  authorize(USER_ROLES.FINANCIAL_ANALYST),
  validate(getFuelByIdSchema),
  validate(updateFuelSchema),
  FuelController.updateFuelLog
);

// DELETE /:id - Delete a fuel log (FINANCIAL_ANALYST only)
router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.FINANCIAL_ANALYST),
  validate(getFuelByIdSchema),
  FuelController.deleteFuelLog
);

export default router;
