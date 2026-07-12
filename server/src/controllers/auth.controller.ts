import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/api-response';
import { ApiError } from '../utils/api-error';
import { asyncHandler } from '../utils/async-handler';

export class AuthController {
  /**
   * Log in user
   */
  public static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    const result = await AuthService.loginUser(email, password);
    
    return res.status(200).json(
      new ApiResponse('Login successful', {
        token: result.token,
        user: result.user,
      })
    );
  });

  /**
   * Get current authenticated user details
   */
  public static me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthenticated'));
    }

    const result = await AuthService.getCurrentUser(req.user.id);
    
    return res.status(200).json(
      new ApiResponse('Authenticated user retrieved', {
        user: result.user,
      })
    );
  });

  /**
   * Log out user (stateless acknowledgement)
   */
  public static logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(
      new ApiResponse('Logout successful', null)
    );
  });
}
