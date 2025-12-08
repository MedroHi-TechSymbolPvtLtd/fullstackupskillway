import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import {
  getReferralPartners,
  createReferralPartner,
  getReferralTestimonials,
  createReferralTestimonial,
  generateReferralCode,
} from '../services/referService';
import { ReferralTestimonialQuery } from '../validators/refer';

export const getReferralPartnersController = asyncHandler(async (_req: Request, res: Response) => {
  const partners = await getReferralPartners();
  sendSuccess(res, partners, 'Referral partners retrieved successfully');
});

export const createReferralPartnerController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const partner = await createReferralPartner(req.body, createdBy);
  sendSuccess(res, partner, 'Referral partner created successfully', 201);
});

export const getReferralTestimonialsController = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ReferralTestimonialQuery;
  const result = await getReferralTestimonials(query);
  const page = Math.floor(result.pagination.offset / result.pagination.limit) + 1;

  sendPaginated(
    res,
    result.testimonials,
    {
      page,
      limit: result.pagination.limit,
      total: result.pagination.total,
    },
    'Referral testimonials retrieved successfully'
  );
});

export const createReferralTestimonialController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const testimonial = await createReferralTestimonial(req.body, createdBy);
  sendSuccess(res, testimonial, 'Referral testimonial created successfully', 201);
});

export const generateReferralCodeController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const code = await generateReferralCode(req.body, createdBy);
  sendSuccess(res, code, 'Referral code generated successfully', 201);
});

