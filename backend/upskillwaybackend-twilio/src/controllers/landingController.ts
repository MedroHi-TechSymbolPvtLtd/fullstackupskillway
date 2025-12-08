import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendSuccess } from '../utils/response';
import { createLandingCertifiedProgram, getLandingCertifiedPrograms } from '../services/landingService';

export const getLandingCertifiedProgramsController = asyncHandler(async (_req: Request, res: Response) => {
  const programs = await getLandingCertifiedPrograms();
  sendSuccess(res, programs, 'Certified programs retrieved successfully');
});

export const createLandingCertifiedProgramController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const program = await createLandingCertifiedProgram(req.body, createdBy);
  sendSuccess(res, program, 'Certified program created successfully', 201);
});

