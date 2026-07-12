import { Router } from 'express';
import { ExportController } from '../controllers/export.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { dateRangeSchema } from '../validators/analytics.validator';

const router = Router();

router.get(
  '/trips.csv',
  authenticate,
  validate(dateRangeSchema),
  ExportController.exportTrips
);

router.get(
  '/fuel.csv',
  authenticate,
  validate(dateRangeSchema),
  ExportController.exportFuelLogs
);

router.get(
  '/expenses.csv',
  authenticate,
  validate(dateRangeSchema),
  ExportController.exportExpenses
);

export default router;
