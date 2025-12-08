import { z } from 'zod';

/**
 * College-Trainer Assignment validation schemas
 */

// Assign trainer to college validation
export const assignTrainerToCollegeSchema = z.object({
  trainerId: z.string().uuid('Invalid trainer ID'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Unassign trainer from college validation
export const unassignTrainerFromCollegeSchema = z.object({
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Get available trainers query validation
export const availableTrainersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  specialization: z.string().optional(),
  location: z.string().optional(),
  experience: z.coerce.number().int().min(0).optional(),
});

// College trainer assignment query validation
export const collegeTrainerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  collegeId: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string().uuid('Invalid college ID').optional()
  ),
  trainerId: z.preprocess(
    (val) => (val === '' || val === null ? undefined : val),
    z.string().uuid('Invalid trainer ID').optional()
  ),
  status: z.string().optional(),
});

// Export types
export type AssignTrainerToCollegeInput = z.infer<typeof assignTrainerToCollegeSchema>;
export type UnassignTrainerFromCollegeInput = z.infer<typeof unassignTrainerFromCollegeSchema>;
export type AvailableTrainersQueryInput = z.infer<typeof availableTrainersQuerySchema>;
export type CollegeTrainerQueryInput = z.infer<typeof collegeTrainerQuerySchema>;
