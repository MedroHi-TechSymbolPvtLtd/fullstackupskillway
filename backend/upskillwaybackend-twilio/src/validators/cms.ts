import { z } from 'zod';
import { slugSchema } from '../utils/validation';

/**
 * CMS content validation schemas
 */

// Common content fields
const commonContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: slugSchema,
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

// Blog validation
export const blogSchema = commonContentSchema.extend({
  excerpt: z.string().max(500, 'Excerpt too long').optional(),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  category: z.string().max(100, 'Category too long').optional(),
  tags: z.array(z.string()).default([]),
});

export const updateBlogSchema = blogSchema.partial();

// Video validation
const masteredToolSchemaForVideo = z.object({
  name: z.string().min(1, 'Tool name is required'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
});

const faqSchemaForVideo = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export const videoSchema = commonContentSchema.extend({
  description: z.string().max(1000, 'Description too long').optional(),
  videoUrl: z.string().url('Invalid video URL'),
  tags: z.array(z.string()).default([]),
  masteredTools: z.array(masteredToolSchemaForVideo).optional(),
  faqs: z.array(faqSchemaForVideo).optional(),
});

export const updateVideoSchema = videoSchema.partial();

// FAQ validation
export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.string().max(100, 'Category too long').optional(),
});

export const updateFaqSchema = faqSchema.partial();

// Testimonial validation
export const testimonialSchema = z.object({
  authorName: z.string().min(1, 'Author name is required').max(100, 'Author name too long'),
  role: z.string().max(100, 'Role too long').optional(),
  companyName: z.string().max(150, 'Company name too long').optional(),
  companyLogoUrl: z.string().url('Invalid company logo URL').optional(),
  category: z.string().max(100, 'Category too long').optional(),
  text: z.string().min(1, 'Testimonial text is required').max(1000, 'Text too long'),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  videoUrl: z.string().url('Invalid video URL').optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewSource: z.string().max(100, 'Review source too long').optional(),
  socialHandle: z.string().max(200, 'Social handle too long').optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['pending', 'approved']).default('pending'),
});

export const updateTestimonialSchema = testimonialSchema.partial();

// Course validation schemas for nested JSON fields
const masteredToolSchema = z.object({
  name: z.string().min(1, 'Tool name is required'),
  logoUrl: z.string().url('Invalid logo URL').optional(),
});

export const curriculumModuleSchema = z.object({
  moduleTitle: z.string().min(1, 'Module title is required'),
  topics: z.array(z.string()).default([]),
});

const trainingOptionSchema = z.object({
  name: z.string().min(1, 'Training option name is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  currency: z.string().default('INR'),
  descriptionPoints: z.array(z.string()).default([]),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  description: z.string().optional(),
});

export const mentorSchema = z.object({
  name: z.string().min(1, 'Mentor name is required'),
  title: z.string().min(1, 'Mentor title is required'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  bio: z.string().optional(),
});

export const mentorSocialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid social link URL'),
});

const careerRoleSchema = z.object({
  title: z.string().min(1, 'Role title is required'),
  description: z.string().min(1, 'Role description is required'),
});

const testimonialSchemaForCourse = z.object({
  studentName: z.string().min(1, 'Student name is required'),
  studentRole: z.string().optional(),
  testimonialText: z.string().min(1, 'Testimonial text is required'),
  rating: z.number().min(1).max(5).optional(),
  studentImageUrl: z.string().url('Invalid image URL').optional(),
});

const faqSchemaForCourse = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

const relatedProgramSchema = z.object({
  title: z.string().min(1, 'Program title is required'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  duration: z.string().optional(),
  price: z.string().optional(),
  slug: z.string().optional(),
});

// Course validation
export const courseSchema = commonContentSchema.extend({
  description: z.string().max(1000, 'Description too long').optional(),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  microDescription: z.string().max(1000, 'Micro description too long').optional(),
  heroSubTitle: z.string().max(300, 'Hero subtitle too long').optional(),
  syllabus: z.string().optional(), // Can be text or JSON
  videoDemoUrl: z.string().url('Invalid video URL').optional(),
  tags: z.array(z.string()).default([]),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  // New fields for enhanced course pages
  bannerImageUrl: z.string().url('Invalid banner image URL').optional(),
  programName: z.string().max(200, 'Program name too long').optional(),
  durationMonths: z.number().int().min(0, 'Duration in months cannot be negative').optional(),
  durationHours: z.number().int().min(0, 'Duration in hours cannot be negative').optional(),
  deliveryModes: z.array(z.string()).default([]),
  language: z.string().max(50, 'Language name too long').optional(),
  aboutSectionImageUrl: z.string().url('Invalid about section image URL').optional(),
  masteredTools: z.array(masteredToolSchema).optional(),
  curriculum: z.array(curriculumModuleSchema).optional(),
  curriculumOutline: z.array(curriculumModuleSchema).optional(),
  trainingOptions: z.array(trainingOptionSchema).optional(),
  projects: z.array(projectSchema).optional(),
  mentors: z.array(mentorSchema).optional(),
  mentorSocialLinks: z.array(mentorSocialLinkSchema).optional(),
  careerRoles: z.array(careerRoleSchema).optional(),
  testimonials: z.array(testimonialSchemaForCourse).optional(),
  reviewSummary: z.record(z.any()).optional(),
  faqs: z.array(faqSchemaForCourse).optional(),
  relatedPrograms: z.array(relatedProgramSchema).optional(),
});

export const updateCourseSchema = courseSchema.partial();

// Ebook validation
export const ebookSchema = commonContentSchema.extend({
  description: z.string().max(1000, 'Description too long').optional(),
  coverImageUrl: z.string().url('Invalid cover image URL').optional(),
  pdfUrl: z.string().url('Invalid PDF URL'),
  tags: z.array(z.string()).default([]),
});

export const updateEbookSchema = ebookSchema.partial();

// FAQ schema for Study Abroad
const studyAbroadFaqSchema = z.object({
  question: z.string().min(1, 'Question is required').max(500, 'Question too long'),
  answer: z.string().min(1, 'Answer is required').max(2000, 'Answer too long'),
});

// Study Abroad validation
export const studyAbroadSchema = z.object({
  city: z.string().min(1, 'City is required').max(100, 'City name too long'),
  country: z.string().max(100, 'Country name too long').optional(),
  destinationType: z.string().max(50, 'Destination type too long').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  universities: z.array(z.string().min(1, 'University name cannot be empty')).min(1, 'At least one university is required'),
  avgTuition: z.number().min(0, 'Average tuition cannot be negative').optional(),
  pricePerYear: z.number().min(0, 'Price per year cannot be negative').optional(),
  livingCost: z.number().min(0, 'Living cost cannot be negative').optional(),
  durationMonths: z.number().int().min(0, 'Duration cannot be negative').optional(),
  partTimeAvailable: z.boolean().optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  tags: z.array(z.string()).default([]),
  programs: z.array(z.enum(['undergraduate', 'postgraduate', 'short_term', 'scholarship_program'])).default([]),
  destinationHighlights: z.array(z.record(z.any())).optional(),
  filterOptions: z.record(z.any()).optional(),
  programDetails: z.array(z.record(z.any())).optional(),
  faqs: z.array(studyAbroadFaqSchema).optional(),
  testimonialBlocks: z.array(z.record(z.any())).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export const updateStudyAbroadSchema = studyAbroadSchema.partial();

// Short Course validation
export const shortCourseSchema = commonContentSchema.extend({
  description: z.string().max(1000, 'Description too long').optional(),
  heroImageUrl: z.string().url('Invalid hero image URL').optional(),
  fallbackImageUrl: z.string().url('Invalid fallback image URL').optional(),
  syllabus: z.string().optional(), // Can be text or JSON
  videoDemoUrl: z.string().url('Invalid video URL').optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().max(100, 'Category too long').optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  faqs: z.array(faqSchemaForCourse).optional(),
  testimonials: z.array(testimonialSchemaForCourse).optional(),
});

export const updateShortCourseSchema = shortCourseSchema.partial();

// Certified Course validation
export const certifiedCourseSchema = commonContentSchema.extend({
  description: z.string().max(1000, 'Description too long').optional(),
  syllabus: z.string().optional(), // Can be text or JSON
  videoDemoUrl: z.string().url('Invalid video URL').optional(),
  tags: z.array(z.string()).default([]),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  badgeLabel: z.string().max(100, 'Badge label too long').optional(),
  landingCardImageUrl: z.string().url('Invalid landing image URL').optional(),
  landingHighlights: z.array(z.string()).optional(),
  reviewSummary: z.record(z.any()).optional(),
  averageRating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

export const updateCertifiedCourseSchema = certifiedCourseSchema.partial();

export const courseCurriculumUpdateSchema = z.object({
  curriculum: z.array(curriculumModuleSchema).min(1, 'At least one module is required'),
});

export const courseShortDescriptionSchema = z.object({
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(500, 'Short description too long'),
});

export const courseMentorUpdateSchema = z.object({
  mentors: z.array(mentorSchema).min(1, 'At least one mentor is required'),
  mentorSocialLinks: z.array(mentorSocialLinkSchema).optional(),
});

// Export types
export type BlogInput = z.infer<typeof blogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type UpdateFAQInput = z.infer<typeof updateFaqSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type ShortCourseInput = z.infer<typeof shortCourseSchema>;
export type UpdateShortCourseInput = z.infer<typeof updateShortCourseSchema>;
export type CertifiedCourseInput = z.infer<typeof certifiedCourseSchema>;
export type UpdateCertifiedCourseInput = z.infer<typeof updateCertifiedCourseSchema>;
export type EbookInput = z.infer<typeof ebookSchema>;
export type UpdateEbookInput = z.infer<typeof updateEbookSchema>;
export type StudyAbroadInput = z.infer<typeof studyAbroadSchema>;
export type UpdateStudyAbroadInput = z.infer<typeof updateStudyAbroadSchema>;
export type CourseCurriculumInput = z.infer<typeof courseCurriculumUpdateSchema>;
export type CourseShortDescriptionInput = z.infer<typeof courseShortDescriptionSchema>;
export type CourseMentorInput = z.infer<typeof courseMentorUpdateSchema>;
