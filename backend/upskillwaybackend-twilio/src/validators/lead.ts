import { z } from 'zod';
import { emailSchema, phoneSchema } from '../utils/validation';
import { LeadStage, LeadStatus, Priority } from '@prisma/client';

/**
 * Lead validation schemas
 */

// Lead creation validation (public form)
export const createLeadSchema = z.object({
  name: z.string().max(100, 'Name too long').optional(),
  email: emailSchema,
  organization: z.string().max(100, 'Organization name too long').optional(),
  phone: phoneSchema.optional(),
  requirement: z.string().max(1000, 'Requirement description too long').optional(),
  source: z.string().max(100, 'Source too long').optional(),
});

// Lead update validation (admin/sales only)
export const updateLeadSchema = z.object({
  name: z.string().max(100, 'Name too long').optional(),
  email: emailSchema.optional(),
  organization: z.string().max(100, 'Organization name too long').optional(),
  phone: phoneSchema.optional(),
  requirement: z.string().max(1000, 'Requirement description too long').optional(),
  source: z.string().max(100, 'Source too long').optional(),
  assignedToId: z.string().uuid().optional(),
  collegeId: z.string().uuid().optional(),
  priority: z.nativeEnum(Priority).optional(),
  stage: z.nativeEnum(LeadStage).optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
  value: z.number().min(0).optional(),
});

// Lead status update validation (admin/sales only)
export const updateLeadStatusSchema = z.object({
  stage: z.nativeEnum(LeadStage, {
    required_error: 'Lead stage is required',
    invalid_type_error: 'Invalid lead stage',
  }),
  status: z.nativeEnum(LeadStatus).optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
  nextFollowUp: z.string().datetime().optional(),
  value: z.number().min(0).optional(),
});

// Lead assignment validation (admin/sales only)
export const assignLeadSchema = z.object({
  assignedToId: z.string().uuid('Invalid user ID'),
  collegeId: z.string().uuid('Invalid college ID').optional(),
  priority: z.nativeEnum(Priority).optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
});

// Lead query validation
export const leadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  stage: z.nativeEnum(LeadStage).optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  assignedTo: z.string().uuid().optional(),
  collegeId: z.string().uuid().optional(),
  source: z.string().optional(),
});

// Export types
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type AssignLeadInput = z.infer<typeof assignLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;
