import { Router } from 'express';
import { DriverController } from '../controllers/driver.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import { USER_ROLES } from '../types/role.types';
import {
  createDriverSchema,
  updateDriverSchema,
  getDriverByIdSchema,
  listDriversSchema,
} from '../validators/driver.validator';

const router = Router();

// GET / - List all drivers (authenticated)
router.get(
  '/',
  authenticate,
  validate(listDriversSchema),
  DriverController.getDrivers
);

// GET /:id - Get driver by ID (authenticated)
router.get(
  '/:id',
  authenticate,
  validate(getDriverByIdSchema),
  DriverController.getDriverById
);

// POST / - Create a new driver (SAFETY_OFFICER only)
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.SAFETY_OFFICER),
  validate(createDriverSchema),
  DriverController.createDriver
);

// PATCH /:id - Update an existing driver (SAFETY_OFFICER only)
router.patch(
  '/:id',
  authenticate,
  authorize(USER_ROLES.SAFETY_OFFICER),
  validate(getDriverByIdSchema),
  validate(updateDriverSchema),
  DriverController.updateDriver
);

// DELETE /:id - Delete a driver (SAFETY_OFFICER only)
router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.SAFETY_OFFICER),
  validate(getDriverByIdSchema),
  DriverController.deleteDriver
);

export default router;
