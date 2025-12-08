import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { LandingCertifiedProgramInput } from '../validators/landing';
import { BadRequestError } from '../utils/errors';

const CODING_CERTIFIED_CATEGORY = 'certified_programs';

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const resolveCreatedBy = async (actorId: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: actorId },
    select: { id: true },
  });

  if (!user) {
    throw new BadRequestError('Invalid user context');
  }

  return user.id;
};

const generateUniqueSlug = async (title: string): Promise<string> => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.certifiedCourse.findUnique({ where: { slug } });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter++}`;
  }
};

type CertifiedProgramCard = {
  id: string;
  title: string;
  shortText: string | null;
  price: number | null;
  imageUrl: string | null;
  profileImageUrl: string | null;
  reviewsCount: number;
  avgRating: number;
};

const formatCard = (
  course: {
    id: string;
    title: string;
    landingShortText: string | null;
    price: Prisma.Decimal | null;
    landingCardImageUrl: string | null;
    profileImageUrl: string | null;
  },
  stats?: { reviewsCount: number; avgRating: number }
): CertifiedProgramCard => ({
  id: course.id,
  title: course.title,
  shortText: course.landingShortText,
  price: course.price ? Number(course.price) : null,
  imageUrl: course.landingCardImageUrl,
  profileImageUrl: course.profileImageUrl,
  reviewsCount: stats?.reviewsCount ?? 0,
  avgRating: Number(stats?.avgRating ?? 0),
});

export const getLandingCertifiedPrograms = async (): Promise<CertifiedProgramCard[]> => {
  const courses = await prisma.certifiedCourse.findMany({
    where: { status: 'published' },
    select: {
      id: true,
      title: true,
      landingShortText: true,
      price: true,
      landingCardImageUrl: true,
      profileImageUrl: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const ids = courses.map(course => course.id);
  const statsMap = new Map<string, { reviewsCount: number; avgRating: number }>();

  if (ids.length > 0) {
    const stats = await prisma.testimonial.groupBy({
      by: ['relatedCertifiedCourseId'],
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
      where: {
        relatedCertifiedCourseId: { in: ids },
        status: 'approved',
        rating: { not: null },
      },
    });

    stats.forEach(stat => {
      if (!stat.relatedCertifiedCourseId) return;
      statsMap.set(stat.relatedCertifiedCourseId, {
        reviewsCount: stat._count._all,
        avgRating: stat._avg.rating ?? 0,
      });
    });
  }

  return courses.map(course => formatCard(course, statsMap.get(course.id)));
};

export const createLandingCertifiedProgram = async (
  payload: LandingCertifiedProgramInput,
  actorId: string
): Promise<CertifiedProgramCard> => {
  const createdBy = await resolveCreatedBy(actorId);
  const slug = await generateUniqueSlug(payload.title);

  const course = await prisma.certifiedCourse.create({
    data: {
      title: payload.title,
      slug,
      status: 'published',
      landingShortText: payload.shortText,
      landingCardImageUrl: payload.imageUrl,
      profileImageUrl: payload.profileImageUrl,
      price: payload.price,
      tags: [CODING_CERTIFIED_CATEGORY],
      createdBy,
    },
    select: {
      id: true,
      title: true,
      landingShortText: true,
      price: true,
      landingCardImageUrl: true,
      profileImageUrl: true,
    },
  });

  return formatCard(course);
};

