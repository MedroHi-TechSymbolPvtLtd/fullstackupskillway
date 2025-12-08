import { z } from 'zod';
import { shortCourseSchema, testimonialSchema } from './cms';

const CODING_KIDS_CATEGORY = 'coding_kids';

export const codingKidsCourseQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).default(0),
});

export const codingKidsCourseCreateSchema = shortCourseSchema.extend({
  category: z.literal(CODING_KIDS_CATEGORY).default(CODING_KIDS_CATEGORY),
});

export const codingKidsFaqQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const codingKidsFaqCreateSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  answer: z.string().min(1, 'Answer is required').max(2000, 'Answer too long'),
});

export const codingKidsTestimonialQuerySchema = z.object({
  status: z.enum(['pending', 'approved']).default('approved'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const codingKidsTestimonialCreateSchema = testimonialSchema.extend({
  category: z.literal(CODING_KIDS_CATEGORY).default(CODING_KIDS_CATEGORY),
});

export type CodingKidsCourseQuery = z.infer<typeof codingKidsCourseQuerySchema>;
export type CodingKidsCourseInput = z.infer<typeof codingKidsCourseCreateSchema>;
export type CodingKidsFaqQuery = z.infer<typeof codingKidsFaqQuerySchema>;
export type CodingKidsFaqInput = z.infer<typeof codingKidsFaqCreateSchema>;
export type CodingKidsTestimonialQuery = z.infer<typeof codingKidsTestimonialQuerySchema>;
export type CodingKidsTestimonialInput = z.infer<typeof codingKidsTestimonialCreateSchema>;

