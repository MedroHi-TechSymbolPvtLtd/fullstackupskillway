import { z } from 'zod';

/**
 * Common validation schemas and utilities
 */

// Common field validations
export const emailSchema = z.string().email('Invalid email format');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
export const phoneSchema = z.string().optional();
export const uuidSchema = z.string().uuid('Invalid UUID format');
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// Search schema
export const searchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  category: z.string().optional(),
});

// Combined pagination and search
export const paginationSearchSchema = paginationSchema.merge(searchSchema);

export const programFilterSchema = z.object({
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minDuration: z.coerce.number().min(0).optional(),
  maxDuration: z.coerce.number().min(0).optional(),
  partTime: z.coerce.boolean().optional(),
  university: z.string().optional(),
  city: z.string().optional(),
  keyword: z.string().optional(),
});

export type ProgramFilterQuery = z.infer<typeof programFilterSchema>;

// Validation helper function for direct use in controllers
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: any): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        const path = err.path.length > 0 ? err.path.join('.') : 'root';
        return `${path}: ${err.message}`;
      });
      return { success: false, errors: errorMessages };
    }
    throw error;
  }
};

// Validation middleware factory (for use in routes)
export const validateSchemaMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => {
          const path = err.path.length > 0 ? err.path.join('.') : 'root';
          return `${path}: ${err.message}`;
        });
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: errorMessages.join(', '),
          timestamp: new Date().toISOString(),
        });
      }
      next(error);
    }
  };
};

// Query validation middleware
export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return res.status(400).json({
          success: false,
          message: 'Query validation failed',
          error: errorMessages.join(', '),
          timestamp: new Date().toISOString(),
        });
      }
      next(error);
    }
  };
};
