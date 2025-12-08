import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import {
  codingKidsCourseCreateSchema,
  CodingKidsCourseInput,
  CodingKidsCourseQuery,
  CodingKidsFaqInput,
  CodingKidsFaqQuery,
  CodingKidsTestimonialInput,
  CodingKidsTestimonialQuery,
} from '../validators/codingKids';
import {
  createShortCourse,
  createFAQ,
  createTestimonial,
} from './cmsService';

const CODING_KIDS_CATEGORY = 'coding_kids';

export const getCodingKidsCourses = async (query: CodingKidsCourseQuery) => {
  const { status, limit, offset } = query;

  const where: Prisma.ShortCourseWhereInput = {
    category: CODING_KIDS_CATEGORY,
  };

  if (status) {
    where.status = status as any;
  } else {
    where.status = 'published';
  }

  const [courses, total] = await Promise.all([
    prisma.shortCourse.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shortCourse.count({ where }),
  ]);

  return {
    courses,
    pagination: {
      limit,
      offset,
      total,
    },
  };
};

export const createCodingKidsCourse = async (payload: CodingKidsCourseInput, actorId: string) => {
  const data = codingKidsCourseCreateSchema.parse(payload);
  return createShortCourse(data, actorId);
};

export const getCodingKidsFaqs = async (query: CodingKidsFaqQuery) => {
  const { limit, offset } = query;

  const where: Prisma.FAQWhereInput = { category: CODING_KIDS_CATEGORY };

  const [faqs, total] = await Promise.all([
    prisma.fAQ.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.fAQ.count({ where }),
  ]);

  return {
    faqs,
    pagination: {
      limit,
      offset,
      total,
    },
  };
};

export const createCodingKidsFaq = async (payload: CodingKidsFaqInput, actorId: string) => {
  return createFAQ(
    {
      ...payload,
      category: CODING_KIDS_CATEGORY,
    },
    actorId
  );
};

export const getCodingKidsTestimonials = async (query: CodingKidsTestimonialQuery) => {
  const { status, limit, offset } = query;

  const where: Prisma.TestimonialWhereInput = {
    category: CODING_KIDS_CATEGORY,
  };

  if (status) {
    where.status = status;
  }

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.testimonial.count({ where }),
  ]);

  return {
    testimonials,
    pagination: {
      limit,
      offset,
      total,
    },
  };
};

export const createCodingKidsTestimonial = async (payload: CodingKidsTestimonialInput, actorId: string) => {
  return createTestimonial(
    {
      ...payload,
      category: CODING_KIDS_CATEGORY,
    },
    actorId
  );
};

