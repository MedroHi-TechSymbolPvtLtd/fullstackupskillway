import { z } from 'zod';
import { CollegeType, CollegeStatus } from '@prisma/client';

const sanitizeString = (value: unknown) => {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  if (trimmed === '') {
    return undefined;
  }
  const normalized = trimmed.toLowerCase();
  if (normalized === 'null' || normalized === 'nil' || normalized === 'undefined' || normalized === 'none') {
    return undefined;
  }
  return trimmed;
};

const optionalString = z.preprocess(sanitizeString, z.string().optional());

const optionalEmail = z.preprocess(sanitizeString, z.string().email().optional());

const optionalUrl = z.preprocess(sanitizeString, z.string().url().optional());

const optionalUUID = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'null' || normalized === 'nil' || normalized === 'undefined' || normalized === 'none' || normalized === 'nill') {
      return undefined;
    }
    return value.trim();
  }
  return value;
}, z.string().uuid().optional());

const numberPreprocess = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
};

const optionalPositiveInt = z
  .preprocess(numberPreprocess, z.number().int().positive())
  .optional();

const optionalYear = z
  .preprocess(numberPreprocess, z.number().int().min(1800).max(new Date().getFullYear()))
  .optional();

const optionalNonNegativeNumber = z
  .preprocess(numberPreprocess, z.number().min(0))
  .optional();

const typeSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value.trim().toUpperCase();
  }
  return value;
}, z.nativeEnum(CollegeType).optional());

const statusSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return CollegeStatus.PROSPECTIVE;
  }
  if (typeof value === 'string') {
    return value.trim().toUpperCase();
  }
  return value;
}, z.nativeEnum(CollegeStatus));

// College validation schemas
export const createCollegeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  location: optionalString,
  city: optionalString,
  state: optionalString,
  type: typeSchema,
  ranking: optionalPositiveInt,
  enrollment: optionalPositiveInt,
  establishedYear: optionalYear,
  contactPerson: optionalString,
  contactEmail: optionalEmail,
  contactPhone: optionalString,
  website: optionalUrl,
  totalRevenue: optionalNonNegativeNumber,
  status: statusSchema,
  assignedToId: optionalUUID, // Optional - can be assigned later
});

export const updateCollegeSchema = createCollegeSchema.partial();

export const collegeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.nativeEnum(CollegeStatus).optional(),
  type: z.nativeEnum(CollegeType).optional(),
  assignedTo: z.string().uuid().optional(),
});

// Types
export type CreateCollegeInput = z.infer<typeof createCollegeSchema>;
export type UpdateCollegeInput = z.infer<typeof updateCollegeSchema>;
export type CollegeQueryInput = z.infer<typeof collegeQuerySchema>;