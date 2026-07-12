import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validate } from '../middleware/validate.middleware';
import { USER_ROLES } from '../types/role.types';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  closeMaintenanceSchema,
  getMaintenanceByIdSchema,
  listMaintenanceSchema,
} from '../validators/maintenance.validator';

const router = Router();

// GET / - List all maintenance records (authenticated)
router.get(
  '/',
  authenticate,
  validate(listMaintenanceSchema),
  MaintenanceController.getMaintenanceRecords
);

// POST / - Create a new maintenance record (FLEET_MANAGER only)
router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.FLEET_MANAGER),
  validate(createMaintenanceSchema),
  MaintenanceController.createMaintenance
);

// PATCH /:id/close - Close a maintenance record (FLEET_MANAGER only)
router.patch(
  '/:id/close',
  authenticate,
  authorize(USER_ROLES.FLEET_MANAGER),
  validate(getMaintenanceByIdSchema),
  validate(closeMaintenanceSchema),
  MaintenanceController.closeMaintenance
);

// GET /:id - Get maintenance record by ID (authenticated)
router.get(
  '/:id',
  authenticate,
  validate(getMaintenanceByIdSchema),
  MaintenanceController.getMaintenanceById
);

// PATCH /:id - Update an existing maintenance record (FLEET_MANAGER only)
router.patch(
  '/:id',
  authenticate,
  authorize(USER_ROLES.FLEET_MANAGER),
  validate(getMaintenanceByIdSchema),
  validate(updateMaintenanceSchema),
  MaintenanceController.updateMaintenance
);

export default router;
