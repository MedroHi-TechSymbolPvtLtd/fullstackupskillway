import { randomBytes } from 'crypto';
import prisma from '../config/database';
import { ReferralPartnerInput, ReferralTestimonialInput, ReferralTestimonialQuery, ReferralCodeGenerateInput } from '../validators/refer';
import { NotFoundError, BadRequestError } from '../utils/errors';

const REFERRAL_CATEGORY = 'referral';

const ensureUserExists = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user.id;
};

const ensurePartnerExists = async (partnerId: string): Promise<void> => {
  const partner = await prisma.referralPartner.findUnique({ where: { id: partnerId } });
  if (!partner) {
    throw new NotFoundError('Referral partner not found');
  }
};

export const getReferralPartners = async () => {
  return prisma.referralPartner.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
};

export const createReferralPartner = async (partnerData: ReferralPartnerInput, actorId: string) => {
  const createdBy = await ensureUserExists(actorId);
  return prisma.referralPartner.create({
    data: {
      ...partnerData,
      createdBy,
    },
  });
};

export const getReferralTestimonials = async (query: ReferralTestimonialQuery) => {
  const { status, limit, offset } = query;

  const where: any = {
    category: REFERRAL_CATEGORY,
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

export const createReferralTestimonial = async (testimonialData: ReferralTestimonialInput, actorId: string) => {
  const createdBy = await ensureUserExists(actorId);

  return prisma.testimonial.create({
    data: {
      ...testimonialData,
      category: REFERRAL_CATEGORY,
      createdBy,
    },
  });
};

const generateUniqueCode = async (): Promise<string> => {
  const candidate = randomBytes(3).toString('hex').toUpperCase();
  const code = `REF-${candidate}`;
  const existing = await prisma.referralCode.findUnique({ where: { code } });
  if (existing) {
    return generateUniqueCode();
  }
  return code;
};

export const generateReferralCode = async (payload: ReferralCodeGenerateInput, actorId: string) => {
  if (payload.partnerId) {
    await ensurePartnerExists(payload.partnerId);
  }

  const createdBy = await ensureUserExists(actorId);
  const code = await generateUniqueCode();

  const referralCode = await prisma.referralCode.create({
    data: {
      code,
      partnerId: payload.partnerId,
      metadata: payload.metadata,
      createdBy,
    },
    select: {
      code: true,
      partnerId: true,
    },
  });

  return referralCode;
};

