import { z } from 'zod';
import { TrainerStatus, TrainingMode } from '@prisma/client';

// Trainer validation schemas
export const createTrainerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  specialization: z.array(z.string()).default([]),
  experience: z.number().int().min(0).optional(),
  location: z.string().optional(),
  trainingMode: z.array(z.nativeEnum(TrainingMode)).default([]),
  languages: z.array(z.string()).default([]),
  status: z.nativeEnum(TrainerStatus).default(TrainerStatus.AVAILABLE),
});

export const updateTrainerSchema = createTrainerSchema.partial();

export const trainerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.nativeEnum(TrainerStatus).optional(),
  specialization: z.string().optional(),
});

// Types
export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>;
export type TrainerQueryInput = z.infer<typeof trainerQuerySchema>;