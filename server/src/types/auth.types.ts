import { UserRole } from './role.types';

export { UserRole };

export const SUPPORTED_ROLES = [
  'ADMIN',
  'FLEET_MANAGER',
  'DISPATCHER',
  'SAFETY_OFFICER',
  'FINANCIAL_ANALYST',
] as const;

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
