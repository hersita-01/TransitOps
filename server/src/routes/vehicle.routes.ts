import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import { USER_ROLES } from '../types/role.types';
import {
  createVehicleSchema,
  updateVehicleSchema,
  getVehicleByIdSchema,
  listVehiclesSchema,
} from '../validators/vehicle.validator';

const router = Router();

// GET / - List all vehicles (authenticated)
router.get(
  '/',
  authenticate,
  validate(listVehiclesSchema),
  VehicleController.getVehicles
);

// GET /:id - Get vehicle by ID (authenticated)
router.get(
  '/:id',
  authenticate,
  validate(getVehicleByIdSchema),
  VehicleController.getVehicleById
);

// POST / - Create a new vehicle (FLEET_MANAGER only)
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.FLEET_MANAGER),
  validate(createVehicleSchema),
  VehicleController.createVehicle
);

// PATCH /:id - Update an existing vehicle (FLEET_MANAGER only)
router.patch(
  '/:id',
  authenticate,
  authorize(USER_ROLES.FLEET_MANAGER),
  validate(getVehicleByIdSchema),
  validate(updateVehicleSchema),
  VehicleController.updateVehicle
);

// DELETE /:id - Delete a vehicle (FLEET_MANAGER only)
router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.FLEET_MANAGER),
  validate(getVehicleByIdSchema),
  VehicleController.deleteVehicle
);

export default router;
