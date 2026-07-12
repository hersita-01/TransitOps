import { Router } from 'express';
import authRoutes from './auth.routes';
import rbacTestRoutes from './rbac-test.routes';

const router = Router();

// Health endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TransitOps API is healthy',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    },
  });
});

// Auth endpoints
router.use('/auth', authRoutes);

// RBAC Test endpoints (development only)
if (process.env.NODE_ENV !== 'production') {
  router.use('/rbac-test', rbacTestRoutes);
}

export default router;
