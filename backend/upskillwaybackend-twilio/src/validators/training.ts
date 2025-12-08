import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { z } from 'zod';
import { slugSchema } from '../utils/validation';

// Training validation schemas using Zod
const curriculumItemSchema = z.object({
  title: z.string().min(1, 'Curriculum item title is required'),
  hours: z.number().int().min(0, 'Hours cannot be negative').optional(),
  content: z.string().optional(),
});

const masteredToolSchema = z.object({
  name: z.string().min(1, 'Tool name is required'),
  url: z.string().url('Invalid logo URL').optional(),
});

const testimonialSchema = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  studentRole: z.string().optional(),
  testimonialText: z.string().min(1, 'Testimonial text is required'),
  rating: z.number().min(1).max(5).optional(),
  studentImageUrl: z.string().url('Invalid image URL').optional(),
});

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export const trainingProgramSchema = z.object({
  programName: z.string().max(200, 'Program name too long').optional(),
  programTitle: z.string().max(200, 'Program title too long').optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: slugSchema,
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  syllabus: z.string().optional(),
  videoDemoUrl: z.string().url('Invalid video URL').optional(),
  tags: z.array(z.string()).default([]),
  price: z.number().min(0, 'Price cannot be negative'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  trainingType: z.enum(['corporate', 'college']),
  // New optional fields for enhanced training type and tool support
  programTrainingType: z.enum(['CORPORATE', 'COLLEGE', 'corporate', 'college']).optional(),
  tool: z.string().url('Tool must be a valid URL').optional(),
  cardImageUrl: z.string().url('Invalid image URL').optional(),
  durationMonths: z.number().int().min(0, 'Duration in months cannot be negative').optional(),
  durationHours: z.number().int().min(0, 'Duration in hours cannot be negative').optional(),
  placementRate: z.number().min(0).max(100, 'Placement rate cannot exceed 100').optional(),
  successMetric: z.string().max(200, 'Success metric too long').optional(),
  durationSummary: z.string().max(200, 'Duration summary too long').optional(),
  timelineSummary: z.string().max(200, 'Timeline summary too long').optional(),
  testimonialHighlight: z.string().max(500, 'Testimonial highlight too long').optional(),
  skills: z.array(z.string()).default([]),
  masteredTools: z.array(masteredToolSchema).optional(),
  curriculum: z.array(curriculumItemSchema).optional(),
  testimonials: z.array(testimonialSchema).optional(),
  faqs: z.array(faqSchema).optional(),
  badges: z.array(z.string()).default([]),
});

export const updateTrainingProgramSchema = trainingProgramSchema.partial().extend({
  price: z.number().min(0, 'Price cannot be negative').optional(),
  trainingType: z.enum(['corporate', 'college']).optional(),
  // New optional fields for enhanced training type and tool support
  programTrainingType: z.enum(['CORPORATE', 'COLLEGE', 'corporate', 'college']).optional(),
  tool: z.string().url('Tool must be a valid URL').optional(),
});

// Create training validator (using Zod)
export const createTrainingValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    trainingProgramSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, 'Validation error', 400);
  }
};

// Update training validator (using Zod)
export const updateTrainingValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // UUID validation for ID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return sendError(res, 'Invalid training ID', 400);
  }
  
  try {
    updateTrainingProgramSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendError(res, error.errors[0].message, 400);
    }
    return sendError(res, 'Validation error', 400);
  }
};

// Delete training validator
export const deleteTrainingValidator = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // UUID validation for ID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return sendError(res, 'Invalid training ID', 400);
  }
  
  next();
};

// Get training by ID validator
export const getTrainingByIdValidator = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  // UUID validation for ID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return sendError(res, 'Invalid training ID', 400);
  }
  
  next();
};

// Get trainings validator
export const getTrainingsValidator = (req: Request, res: Response, next: NextFunction) => {
  const { trainingType, programTrainingType } = req.query;
  
  if (trainingType && !['corporate', 'college'].includes(trainingType as string)) {
    return sendError(res, 'Training type must be either corporate or college', 400);
  }
  
  // Validate programTrainingType if provided (accepts both uppercase and lowercase)
  if (programTrainingType && !['CORPORATE', 'COLLEGE', 'corporate', 'college'].includes(programTrainingType as string)) {
    return sendError(res, 'Program training type must be either CORPORATE or COLLEGE (case-insensitive)', 400);
  }
  
  next();
};

// Export TypeScript types
export type TrainingProgramInput = z.infer<typeof trainingProgramSchema>;
export type UpdateTrainingProgramInput = z.infer<typeof updateTrainingProgramSchema>;