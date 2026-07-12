import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /kpis (or / depending on frontend contract, we will mount at /api/v1/dashboard so we provide both or just /)
// Let's provide /kpis and / (fallback to kpis)
router.get(
  '/',
  authenticate,
  DashboardController.getDashboardKpis
);

router.get(
  '/kpis',
  authenticate,
  DashboardController.getDashboardKpis
);

export default router;
