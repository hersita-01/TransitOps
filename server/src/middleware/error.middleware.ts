import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV === 'development';
  
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors: any[] | undefined = err.errors;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((issue) => ({
      field: issue.path.join('.'),
      detail: issue.message,
    }));
  }

  // Handle Prisma Known Request Errors safely without direct class imports (dynamic property checking)
  // Prisma errors typically have `code` (e.g. 'P2002') and `clientVersion`.
  if (err.code && typeof err.code === 'string' && err.clientVersion) {
    statusCode = 400; // Default request issue
    if (err.code === 'P2002') {
      statusCode = 409; // Conflict
      const targetFields = err.meta?.target ? ` (${(err.meta.target as string[]).join(', ')})` : '';
      message = `A record with this value already exists${targetFields}.`;
    } else if (err.code === 'P2025') {
      statusCode = 404; // Not Found
      message = err.meta?.cause || 'Record to update or delete not found.';
    } else if (err.code === 'P2003') {
      message = 'Foreign key constraint failed. A referenced record does not exist.';
    } else {
      message = 'Database operation failed.';
    }
  }

  // Log errors following the logging principles (zero sensitive data)
  if (statusCode === 500) {
    console.error(`[ERROR] Internal Server Error: ${err.message}`, isDev && err.stack ? err.stack : '');
  } else {
    console.warn(`[WARN] Client Error (${statusCode}): ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(isDev && statusCode === 500 ? { stack: err.stack } : {}),
  });
};
