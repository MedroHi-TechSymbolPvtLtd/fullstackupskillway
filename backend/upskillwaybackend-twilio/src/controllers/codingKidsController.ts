import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendPaginated, sendSuccess } from '../utils/response';
import {
  getCodingKidsCourses,
  createCodingKidsCourse,
  getCodingKidsFaqs,
  createCodingKidsFaq,
  getCodingKidsTestimonials,
  createCodingKidsTestimonial,
} from '../services/codingKidsService';
import {
  CodingKidsCourseQuery,
  CodingKidsFaqQuery,
  CodingKidsTestimonialQuery,
} from '../validators/codingKids';

const offsetToPage = (offset: number, limit: number): number => Math.floor(offset / limit) + 1;

export const getCodingKidsCoursesController = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as CodingKidsCourseQuery;
  const result = await getCodingKidsCourses(query);
  const page = offsetToPage(query.offset, query.limit);

  sendPaginated(
    res,
    result.courses,
    {
      page,
      limit: query.limit,
      total: result.pagination.total,
    },
    'Coding for Kids courses retrieved successfully'
  );
});

export const createCodingKidsCourseController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const course = await createCodingKidsCourse(req.body, createdBy);
  sendSuccess(res, course, 'Coding for Kids course created successfully', 201);
});

export const getCodingKidsFaqsController = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as CodingKidsFaqQuery;
  const result = await getCodingKidsFaqs(query);
  const page = offsetToPage(query.offset, query.limit);

  sendPaginated(
    res,
    result.faqs,
    {
      page,
      limit: query.limit,
      total: result.pagination.total,
    },
    'Coding for Kids FAQs retrieved successfully'
  );
});

export const createCodingKidsFaqController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const faq = await createCodingKidsFaq(req.body, createdBy);
  sendSuccess(res, faq, 'Coding for Kids FAQ created successfully', 201);
});

export const getCodingKidsTestimonialsController = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as CodingKidsTestimonialQuery;
  const result = await getCodingKidsTestimonials(query);
  const page = offsetToPage(query.offset, query.limit);

  sendPaginated(
    res,
    result.testimonials,
    {
      page,
      limit: query.limit,
      total: result.pagination.total,
    },
    'Coding for Kids testimonials retrieved successfully'
  );
});

export const createCodingKidsTestimonialController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const testimonial = await createCodingKidsTestimonial(req.body, createdBy);
  sendSuccess(res, testimonial, 'Coding for Kids testimonial created successfully', 201);
});

