import { z } from 'zod';
import { LeadStage, Priority, ActivityType } from '@prisma/client';

// CRM Lead validation schemas
export const updateCrmLeadSchema = z.object({
  stage: z.nativeEnum(LeadStage).optional(),
  priority: z.nativeEnum(Priority).optional(),
  notes: z.string().optional(),
  assignedToId: z.string().uuid().optional(),
});

export const crmLeadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  assignedTo: z.string().uuid().optional(),
  stage: z.nativeEnum(LeadStage).optional(),
  priority: z.nativeEnum(Priority).optional(),
});

export const leadActivitySchema = z.object({
  type: z.nativeEnum(ActivityType),
  description: z.string().min(1, 'Description is required'),
  notes: z.string().optional(),
});

// Types
export type UpdateCrmLeadInput = z.infer<typeof updateCrmLeadSchema>;
export type CrmLeadQueryInput = z.infer<typeof crmLeadQuerySchema>;
export type LeadActivityInput = z.infer<typeof leadActivitySchema>;