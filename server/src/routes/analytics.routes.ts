import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { dateRangeSchema } from '../validators/analytics.validator';

const router = Router();

router.get(
  '/overview',
  authenticate,
  validate(dateRangeSchema),
  AnalyticsController.getOverview
);

router.get(
  '/trips',
  authenticate,
  validate(dateRangeSchema),
  AnalyticsController.getTripAnalytics
);

router.get(
  '/fuel',
  authenticate,
  validate(dateRangeSchema),
  AnalyticsController.getFuelAnalytics
);

router.get(
  '/expenses',
  authenticate,
  validate(dateRangeSchema),
  AnalyticsController.getExpenseAnalytics
);

export default router;
