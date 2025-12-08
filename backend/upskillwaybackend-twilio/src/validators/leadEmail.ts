import { z } from 'zod';

/**
 * Lead Email Validators
 */

export const sendEmailToLeadSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID format').optional(),
  email: z.string().email('Invalid email address').optional(),
  templateId: z.string().uuid('Invalid template ID format').optional(),
  subject: z.string().min(1, 'Subject is required').max(200).optional(),
  html: z.string().min(1, 'HTML content is required').optional(),
  text: z.string().optional(),
}).refine(
  (data) => data.leadId || data.email,
  { message: 'Either leadId or email must be provided' }
).refine(
  (data) => data.templateId || (data.subject && data.html),
  { message: 'Either templateId or both subject and html must be provided' }
);

export const sendEmailToAllLeadsSchema = z.object({
  templateId: z.string().uuid('Invalid template ID format').optional(),
  subject: z.string().min(1, 'Subject is required').max(200).optional(),
  html: z.string().min(1, 'HTML content is required').optional(),
  text: z.string().optional(),
  filters: z.object({
    stage: z.string().optional(),
    status: z.string().optional(),
    source: z.string().optional(),
    assignedToId: z.string().uuid().optional(),
  }).optional(),
}).refine(
  (data) => data.templateId || (data.subject && data.html),
  { message: 'Either templateId or both subject and html must be provided' }
);

export type SendEmailToLeadInput = z.infer<typeof sendEmailToLeadSchema>;
export type SendEmailToAllLeadsInput = z.infer<typeof sendEmailToAllLeadsSchema>;





