import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/api-error';
import { signToken } from '../utils/jwt';

export class AuthService {
  /**
   * Log in a user with email and password
   */
  public static async loginUser(email: string, password: string) {
    // Find the user in the database.
    // Note: This relies on the User model being defined in the Prisma schema by the Database Engineer.
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate JWT token containing identity information
    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    // Return token and safe user representation
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Fetch current authenticated user by ID
   */
  public static async getCurrentUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
