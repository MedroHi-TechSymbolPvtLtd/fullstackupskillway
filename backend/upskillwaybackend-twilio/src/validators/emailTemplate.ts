import { z } from 'zod';

/**
 * Email Template Validators
 */

export const createEmailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(200, 'Template name must not exceed 200 characters'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must not exceed 200 characters'),
  htmlContent: z.string().min(1, 'HTML content is required'),
  textContent: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateEmailTemplateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  subject: z.string().min(1).max(200).optional(),
  htmlContent: z.string().min(1).optional(),
  textContent: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const emailTemplateQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
export type EmailTemplateQueryInput = z.infer<typeof emailTemplateQuerySchema>;





