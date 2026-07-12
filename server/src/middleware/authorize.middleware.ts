import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '../types/role.types';

export const authorize = (...allowedRoles: UserRole[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Read req.user and check whether authenticated identity exists.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // 2. Read req.user.role.
    const { role } = req.user;

    // 3. Compare the trusted authenticated role against the allowed roles.
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    // 4. Call next() when authorized.
    next();
  };
};
