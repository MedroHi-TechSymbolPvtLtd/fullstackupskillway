import { z } from 'zod';
import { TrainerStatus, BookingStatus } from '@prisma/client';

/**
 * Trainer booking validation schemas
 */

// Create trainer booking validation
export const createTrainerBookingSchema = z.object({
  trainerId: z.string().uuid('Invalid trainer ID'),
  collegeId: z.string().uuid('Invalid college ID').optional(), // Optional college assignment
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  bookedBy: z.string().uuid('Invalid user ID').optional(), // Optional for admin bookings
}).refine((data) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  return endTime > startTime;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
}).refine((data) => {
  const startTime = new Date(data.startTime);
  const now = new Date();
  return startTime > now;
}, {
  message: 'Start time must be in the future',
  path: ['startTime'],
});

// Update trainer booking validation
export const updateTrainerBookingSchema = z.object({
  collegeId: z.string().uuid('Invalid college ID').optional(), // Allow updating college assignment
  startTime: z.string().datetime('Invalid start time format').optional(),
  endTime: z.string().datetime('Invalid end time format').optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.nativeEnum(BookingStatus).optional(),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    return endTime > startTime;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

// Update trainer status validation
export const updateTrainerStatusSchema = z.object({
  status: z.nativeEnum(TrainerStatus, {
    required_error: 'Trainer status is required',
    invalid_type_error: 'Invalid trainer status',
  }),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Admin create trainer booking validation (with college assignment by name)
export const adminCreateTrainerBookingSchema = z.object({
  trainerId: z.string().uuid('Invalid trainer ID'),
  collegeName: z.string().min(1, 'College name is required').optional(), // Accept college name instead of UUID
  collegeId: z.string().uuid('Invalid college ID').optional(), // Keep UUID option for backward compatibility
  bookedBy: z.string().uuid('Invalid user ID').optional(), // Admin can assign to any user
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.nativeEnum(BookingStatus).default('ACTIVE').optional(),
}).refine((data) => {
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  return endTime > startTime;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
}).refine((data) => {
  // Ensure either collegeName or collegeId is provided, but not both
  if (data.collegeName && data.collegeId) {
    return false;
  }
  return true;
}, {
  message: 'Provide either collegeName or collegeId, not both',
  path: ['collegeName'],
});

// Trainer booking query validation
export const trainerBookingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  trainerId: z.string().uuid().optional(),
  collegeId: z.string().uuid().optional(), // Add college filtering
  collegeName: z.string().optional(), // Add college name filtering
  status: z.nativeEnum(BookingStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Trainer availability query validation
export const trainerAvailabilityQuerySchema = z.object({
  trainerId: z.string().uuid('Invalid trainer ID'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
});

// Export types
export type CreateTrainerBookingInput = z.infer<typeof createTrainerBookingSchema>;
export type AdminCreateTrainerBookingInput = z.infer<typeof adminCreateTrainerBookingSchema>;
export type UpdateTrainerBookingInput = z.infer<typeof updateTrainerBookingSchema>;
export type UpdateTrainerStatusInput = z.infer<typeof updateTrainerStatusSchema>;
export type TrainerBookingQueryInput = z.infer<typeof trainerBookingQuerySchema>;
export type TrainerAvailabilityQueryInput = z.infer<typeof trainerAvailabilityQuerySchema>;
