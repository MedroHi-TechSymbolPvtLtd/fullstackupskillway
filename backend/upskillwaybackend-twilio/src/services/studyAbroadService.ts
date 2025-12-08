import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import {
  StudyAbroadDestinationQuery,
  StudyAbroadFaqInput,
  StudyAbroadTestimonialInput,
  StudyAbroadTestimonialQuery,
} from '../validators/studyAbroad';
import {
  createStudyAbroad,
  getStudyAbroadById,
  updateStudyAbroad,
  deleteStudyAbroad,
  createFAQ,
  createTestimonial,
} from './cmsService';
import { StudyAbroadCreateInput, StudyAbroadUpdateInput } from '../validators/studyAbroad';

const STUDY_ABROAD_CATEGORY = 'study_abroad';

export const getStudyAbroadDestinations = async (filters: StudyAbroadDestinationQuery) => {
  const { city, university, minTuition, maxTuition, pricePerYear, duration, partTime, limit, offset } = filters;

  const where: Prisma.StudyAbroadWhereInput = {
    status: 'published',
  };

  if (city) {
    where.city = { contains: city, mode: 'insensitive' };
  }

  if (university) {
    where.universities = { has: university };
  }

  if (minTuition !== undefined || maxTuition !== undefined || pricePerYear !== undefined) {
    where.avgTuition = {};
    if (minTuition !== undefined) {
      where.avgTuition.gte = minTuition;
    }
    if (maxTuition !== undefined) {
      where.avgTuition.lte = maxTuition;
    }
    if (pricePerYear !== undefined) {
      where.avgTuition.equals = pricePerYear;
    }
  }

  if (duration !== undefined) {
    where.durationMonths = duration;
  }

  if (partTime !== undefined) {
    where.partTimeAvailable = partTime;
  }

  const [destinations, total] = await Promise.all([
    prisma.studyAbroad.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.studyAbroad.count({ where }),
  ]);

  return {
    destinations,
    pagination: {
      limit,
      offset,
      total,
    },
  };
};

export const createStudyAbroadProgram = async (payload: StudyAbroadCreateInput, actorId: string) => {
  return createStudyAbroad(payload, actorId);
};

export const getStudyAbroadProgramById = async (id: string) => {
  return getStudyAbroadById(id);
};

export const updateStudyAbroadProgram = async (id: string, payload: StudyAbroadUpdateInput) => {
  return updateStudyAbroad(id, payload);
};

export const deleteStudyAbroadProgram = async (id: string) => {
  return deleteStudyAbroad(id);
};

export const getStudyAbroadFaqs = async () => {
  return prisma.fAQ.findMany({
    where: { category: STUDY_ABROAD_CATEGORY },
    orderBy: { createdAt: 'desc' },
  });
};

export const createStudyAbroadFaq = async (payload: StudyAbroadFaqInput, actorId: string) => {
  return createFAQ(
    {
      ...payload,
      category: STUDY_ABROAD_CATEGORY,
    },
    actorId
  );
};

export const getStudyAbroadTestimonials = async (query: StudyAbroadTestimonialQuery) => {
  const { status, limit, offset } = query;

  const where: Prisma.TestimonialWhereInput = {
    category: STUDY_ABROAD_CATEGORY,
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

export const createStudyAbroadTestimonial = async (payload: StudyAbroadTestimonialInput, actorId: string) => {
  return createTestimonial(
    {
      ...payload,
      category: STUDY_ABROAD_CATEGORY,
    },
    actorId
  );
};

