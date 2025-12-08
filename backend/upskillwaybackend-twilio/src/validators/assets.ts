import { z } from 'zod';

export const loadImageFromUrlSchema = z.object({
  url: z.string().url('Invalid image URL'),
});

export type LoadImageFromUrlInput = z.infer<typeof loadImageFromUrlSchema>;

