import { z } from 'zod';
import { AutomationTrigger } from '@prisma/client';

/**
 * Email Automation Validators
 */

export const createEmailAutomationSchema = z.object({
  name: z.string().min(1, 'Automation name is required').max(200, 'Automation name must not exceed 200 characters'),
  description: z.string().optional(),
  triggerType: z.nativeEnum(AutomationTrigger),
  triggerCondition: z.record(z.any()).optional(), // JSON object for additional conditions
  templateId: z.string().uuid('Invalid template ID format'),
  isActive: z.boolean().optional().default(true),
  delayMinutes: z.number().int().min(0).optional().default(0),
});

export const updateEmailAutomationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  triggerType: z.nativeEnum(AutomationTrigger).optional(),
  triggerCondition: z.record(z.any()).optional(),
  templateId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
  delayMinutes: z.number().int().min(0).optional(),
});

export const emailAutomationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  triggerType: z.nativeEnum(AutomationTrigger).optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateEmailAutomationInput = z.infer<typeof createEmailAutomationSchema>;
export type UpdateEmailAutomationInput = z.infer<typeof updateEmailAutomationSchema>;
export type EmailAutomationQueryInput = z.infer<typeof emailAutomationQuerySchema>;





