import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRouter from './routes';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Configure CORS using validated env variables
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Request body parsing middlewares with request size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all API v1 routes
app.use('/api/v1', apiRouter);

// Register 404 Not Found handler after all registered routes
app.use(notFoundMiddleware);

// Register Global Error handling middleware last
app.use(errorMiddleware);

export default app;
