import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import { adminLogin, salesLogin, refreshAccessToken, logout, getUserProfile } from '../services/authService';
import { AdminLoginInput, SalesLoginInput, RefreshTokenInput, LogoutInput } from '../validators/auth';

/**
 * Authentication controller
 * Handles authentication-related endpoints
 */

// Admin login controller
export const adminLoginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: AdminLoginInput = req.body;

  const result = await adminLogin(email, password);

  sendSuccess(res, result, 'Admin login successful');
});

// Sales user login controller
export const salesLoginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: SalesLoginInput = req.body;

  const result = await salesLogin(email, password);

  sendSuccess(res, result, 'Login successful');
});

// Refresh token controller
export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken }: RefreshTokenInput = req.body;

  const result = await refreshAccessToken(refreshToken);

  sendSuccess(res, result, 'Token refreshed successfully');
});

// Logout controller
export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken }: LogoutInput = req.body;

  await logout(refreshToken);

  sendSuccess(res, null, 'Logout successful');
});

// Get user profile controller
export const getUserProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  const user = await getUserProfile(userId, role);

  sendSuccess(res, user, 'User profile retrieved successfully');
});
