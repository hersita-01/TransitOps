import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { USER_ROLES } from '../types/role.types';

const router = Router();

router.get(
  '/fleet-manager',
  authenticate,
  authorize(USER_ROLES.FLEET_MANAGER),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Fleet manager authorization successful',
    });
  }
);

export default router;
