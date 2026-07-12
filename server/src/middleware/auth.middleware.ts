import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '../types/auth.types';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError(401, 'Authorization header is missing'));
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return next(new ApiError(401, 'Authorization header is malformed'));
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return next(new ApiError(401, 'Authorization scheme must be Bearer'));
  }

  if (!token) {
    return next(new ApiError(401, 'Token is missing'));
  }

  try {
    const decoded = verifyToken(token);
    
    // Validate decoded payload structure
    if (!decoded || typeof decoded !== 'object' || !decoded.userId || !decoded.role) {
      return next(new ApiError(401, 'Invalid token payload'));
    }

    // Attach trusted authenticated identity to Express request
    req.user = {
      id: decoded.userId,
      role: decoded.role as UserRole,
    };

    next();
  } catch (error: any) {
    // Return safe public errors and do not leak jsonwebtoken internal messages
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};
