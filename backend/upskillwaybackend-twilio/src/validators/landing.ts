import { z } from 'zod';

export const landingCertifiedProgramCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  shortText: z.string().min(1, 'Short text is required').max(300, 'Short text too long'),
  price: z.number().min(0, 'Price cannot be negative'),
  imageUrl: z.string().url('Invalid image URL'),
  profileImageUrl: z.string().url('Invalid profile image URL').optional(),
});

export type LandingCertifiedProgramInput = z.infer<typeof landingCertifiedProgramCreateSchema>;

