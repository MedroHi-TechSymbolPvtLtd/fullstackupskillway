import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendPaginated, sendSuccess } from '../utils/response';
import {
  getStudyAbroadDestinations,
  createStudyAbroadProgram,
  getStudyAbroadProgramById,
  updateStudyAbroadProgram,
  deleteStudyAbroadProgram,
  getStudyAbroadFaqs,
  createStudyAbroadFaq,
  getStudyAbroadTestimonials,
  createStudyAbroadTestimonial,
} from '../services/studyAbroadService';
import {
  StudyAbroadDestinationQuery,
  StudyAbroadTestimonialQuery,
} from '../validators/studyAbroad';

export const getStudyAbroadDestinationsController = asyncHandler(async (req: Request, res: Response) => {
  const filters = req.query as unknown as StudyAbroadDestinationQuery;
  const result = await getStudyAbroadDestinations(filters);
  const page = Math.floor(filters.offset / filters.limit) + 1;

  sendPaginated(
    res,
    result.destinations,
    {
      page,
      limit: filters.limit,
      total: result.pagination.total,
    },
    'Study abroad destinations retrieved successfully'
  );
});

export const createStudyAbroadProgramController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const studyAbroad = await createStudyAbroadProgram(req.body, createdBy);
  sendSuccess(res, studyAbroad, 'Study abroad program created successfully', 201);
});

export const getStudyAbroadProgramByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const studyAbroad = await getStudyAbroadProgramById(id);
  sendSuccess(res, studyAbroad, 'Study abroad program retrieved successfully');
});

export const updateStudyAbroadProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const studyAbroad = await updateStudyAbroadProgram(id, req.body);
  sendSuccess(res, studyAbroad, 'Study abroad program updated successfully');
});

export const deleteStudyAbroadProgramController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteStudyAbroadProgram(id);
  sendSuccess(res, result, 'Study abroad program deleted successfully');
});

export const getStudyAbroadFaqsController = asyncHandler(async (_req: Request, res: Response) => {
  const faqs = await getStudyAbroadFaqs();
  sendSuccess(res, faqs, 'Study abroad FAQs retrieved successfully');
});

export const createStudyAbroadFaqController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const faq = await createStudyAbroadFaq(req.body, createdBy);
  sendSuccess(res, faq, 'Study abroad FAQ created successfully', 201);
});

export const getStudyAbroadTestimonialsController = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as StudyAbroadTestimonialQuery;
  const result = await getStudyAbroadTestimonials(query);
  const page = Math.floor(query.offset / query.limit) + 1;

  sendPaginated(
    res,
    result.testimonials,
    {
      page,
      limit: query.limit,
      total: result.pagination.total,
    },
    'Study abroad testimonials retrieved successfully'
  );
});

export const createStudyAbroadTestimonialController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const testimonial = await createStudyAbroadTestimonial(req.body, createdBy);
  sendSuccess(res, testimonial, 'Study abroad testimonial created successfully', 201);
});

