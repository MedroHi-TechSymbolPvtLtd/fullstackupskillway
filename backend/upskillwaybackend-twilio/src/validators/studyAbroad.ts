import { z } from 'zod';
import { studyAbroadSchema, updateStudyAbroadSchema, testimonialSchema } from './cms';

export const studyAbroadDestinationQuerySchema = z.object({
  city: z.string().optional(),
  university: z.string().optional(),
  minTuition: z.coerce.number().min(0).optional(),
  maxTuition: z.coerce.number().min(0).optional(),
  pricePerYear: z.coerce.number().min(0).optional(),
  duration: z.coerce.number().int().min(0).optional(),
  partTime: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const studyAbroadFaqCreateSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  answer: z.string().min(1, 'Answer is required').max(2000, 'Answer too long'),
  category: z.string().max(100).default('study_abroad'),
});

export const studyAbroadTestimonialCreateSchema = testimonialSchema.extend({
  category: z.string().max(100).default('study_abroad'),
});

export const studyAbroadTestimonialQuerySchema = z.object({
  status: z.enum(['pending', 'approved']).default('approved'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type StudyAbroadDestinationQuery = z.infer<typeof studyAbroadDestinationQuerySchema>;
export type StudyAbroadFaqInput = z.infer<typeof studyAbroadFaqCreateSchema>;
export type StudyAbroadTestimonialInput = z.infer<typeof studyAbroadTestimonialCreateSchema>;
export type StudyAbroadTestimonialQuery = z.infer<typeof studyAbroadTestimonialQuerySchema>;
export type StudyAbroadCreateInput = z.infer<typeof studyAbroadSchema>;
export type StudyAbroadUpdateInput = z.infer<typeof updateStudyAbroadSchema>;

