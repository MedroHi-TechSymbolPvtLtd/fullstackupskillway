import { z } from 'zod';

// Common content schema that can be shared across different content types
export const commonContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
});

// Mastered Tool Schema
export const masteredToolSchema = z.object({
  name: z.string().min(1, 'Tool name is required').max(100, 'Tool name too long'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
});

// Curriculum Module Schema
export const curriculumModuleSchema = z.object({
  moduleTitle: z.string().min(1, 'Module title is required').max(200, 'Module title too long'),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
});

// Training Option Schema
export const trainingOptionSchema = z.object({
  name: z.string().min(1, 'Training option name is required').max(100, 'Name too long'),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.string().max(10, 'Currency code too long').default('INR'),
  descriptionPoints: z.array(z.string()).min(1, 'At least one description point is required'),
});

// Project Schema
export const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(200, 'Project title too long'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
});

// Mentor Schema
export const mentorSchema = z.object({
  name: z.string().min(1, 'Mentor name is required').max(100, 'Name too long'),
  title: z.string().max(200, 'Title too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
});

// Career Role Schema
export const careerRoleSchema = z.object({
  title: z.string().min(1, 'Career role title is required').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
});

// Testimonial Schema for Course
export const testimonialSchemaForCourse = z.object({
  studentName: z.string().min(1, 'Student name is required').max(100, 'Name too long'),
  studentRole: z.string().max(200, 'Role too long').optional(),
  testimonialText: z.string().min(1, 'Testimonial text is required').max(1000, 'Testimonial too long'),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5').optional(),
  studentImageUrl: z.string().url('Invalid image URL').optional(),
});

// FAQ Schema for Course
export const faqSchemaForCourse = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  answer: z.string().min(1, 'Answer is required').max(1000, 'Answer too long'),
});

// Related Program Schema
export const relatedProgramSchema = z.object({
  title: z.string().min(1, 'Program title is required').max(200, 'Title too long'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  duration: z.string().max(100, 'Duration too long').optional(),
  price: z.string().max(100, 'Price too long').optional(),
  slug: z.string().max(200, 'Slug too long').optional(),
});

// Course Schema extending commonContentSchema
export const courseSchema = commonContentSchema.extend({
  description: z.string().max(1000, 'Description too long').optional(),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  syllabus: z.string().optional(),
  videoDemoUrl: z.string().url('Invalid video URL').optional(),
  tags: z.array(z.string()).default([]),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  bannerImageUrl: z.string().url('Invalid banner image URL').optional(),
  programName: z.string().max(200, 'Program name too long').optional(),
  durationMonths: z.number().int().min(0, 'Duration in months cannot be negative').optional(),
  durationHours: z.number().int().min(0, 'Duration in hours cannot be negative').optional(),
  deliveryModes: z.array(z.string()).default([]),
  language: z.string().max(50, 'Language name too long').optional(),
  aboutSectionImageUrl: z.string().url('Invalid about section image URL').optional(),
  masteredTools: z.array(masteredToolSchema).optional(),
  curriculum: z.array(curriculumModuleSchema).optional(),
  trainingOptions: z.array(trainingOptionSchema).optional(),
  projects: z.array(projectSchema).optional(),
  mentors: z.array(mentorSchema).optional(),
  careerRoles: z.array(careerRoleSchema).optional(),
  testimonials: z.array(testimonialSchemaForCourse).optional(),
  faqs: z.array(faqSchemaForCourse).optional(),
  relatedPrograms: z.array(relatedProgramSchema).optional(),
});




