import { z } from 'zod';
import { testimonialSchema } from './cms';

export const referralPartnerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
  websiteUrl: z.string().url('Invalid website URL').optional(),
  testimonial: z.string().max(1000, 'Testimonial too long').optional(),
  quote: z.string().max(500, 'Quote too long').optional(),
  highlight: z.record(z.any()).optional(),
  rating: z.number().min(0).max(5).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const referralTestimonialCreateSchema = testimonialSchema.extend({
  category: z.literal('referral').default('referral'),
});

export const referralTestimonialQuerySchema = z.object({
  status: z.enum(['pending', 'approved']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const referralCodeGenerateSchema = z.object({
  partnerId: z.string().uuid('Invalid partner ID').optional(),
  metadata: z.record(z.any()).optional(),
});

export type ReferralPartnerInput = z.infer<typeof referralPartnerSchema>;
export type ReferralTestimonialInput = z.infer<typeof referralTestimonialCreateSchema>;
export type ReferralTestimonialQuery = z.infer<typeof referralTestimonialQuerySchema>;
export type ReferralCodeGenerateInput = z.infer<typeof referralCodeGenerateSchema>;

