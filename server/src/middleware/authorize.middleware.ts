import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from '../utils/api-error';
import { UserRole, SUPPORTED_ROLES } from '../types/auth.types';

export const authorizeRoles = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Read req.user from trusted authentication context.
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const { role } = req.user;

    // 2. Validate role against the supported role contract.
    if (!SUPPORTED_ROLES.includes(role)) {
      return next(new ApiError(401, 'Invalid or unsupported user role'));
    }

    // 3. Allow ADMIN automatically.
    if (role === 'ADMIN') {
      return next();
    }

    // 4. Check whether the user's role exists in allowedRoles.
    if (allowedRoles.includes(role)) {
      return next();
    }

    // 5. Return 403 Forbidden when authenticated but unauthorized.
    return next(new ApiError(403, 'Forbidden: You do not have permission to perform this action'));
  };
};
