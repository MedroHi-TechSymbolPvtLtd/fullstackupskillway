import { z } from 'zod';

/**
 * Authentication validation schemas
 */

// Admin login validation
export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Sales user login validation
export const salesLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Refresh token validation
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Logout validation
export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Export types
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type SalesLoginInput = z.infer<typeof salesLoginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
