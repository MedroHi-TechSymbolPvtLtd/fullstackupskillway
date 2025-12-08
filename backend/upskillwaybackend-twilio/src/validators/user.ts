import { z } from 'zod';
import { emailSchema, passwordSchema, phoneSchema } from '../utils/validation';

/**
 * User validation schemas
 */

// Create user validation
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

// Update user validation
export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  password: passwordSchema.optional(),
});

// User activation/deactivation
export const userStatusSchema = z.object({
  isActive: z.boolean(),
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserStatusInput = z.infer<typeof userStatusSchema>;
