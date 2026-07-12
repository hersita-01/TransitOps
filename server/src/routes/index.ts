import { Router } from 'express';
import authRoutes from './auth.routes';

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

export default router;
