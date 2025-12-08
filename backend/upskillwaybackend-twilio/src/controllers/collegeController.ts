import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import {
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  assignTrainerToCollege,
  getCollegeStats,
  getCollegesByStatus,
} from '../services/collegeService';
import { 
  createCollegeSchema,
  updateCollegeSchema,
  collegeQuerySchema,
  CreateCollegeInput,
  UpdateCollegeInput 
} from '../validators/college';

/**
 * @swagger
 * components:
 *   schemas:
 *     College:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         type:
 *           type: string
 *           enum: [ENGINEERING, MEDICAL, MANAGEMENT, ARTS_SCIENCE, LAW, PHARMACY, ARCHITECTURE, OTHER]
 *         ranking:
 *           type: integer
 *         enrollment:
 *           type: integer
 *         contactPerson:
 *           type: string
 *         contactEmail:
 *           type: string
 *         contactPhone:
 *           type: string
 *         totalRevenue:
 *           type: number
 *         avgRating:
 *           type: number
 *         status:
 *           type: string
 *           enum: [PROSPECTIVE, ACTIVE, INACTIVE, PARTNER]
 *         assignedTo:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 */

// Get all colleges
export const getAllCollegesController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, status, type, assignedTo } = collegeQuerySchema.parse(req.query);

  const result = await getAllColleges(page, limit, {
    search,
    status,
    type,
    assignedTo,
  });

  sendPaginated(res, result.colleges, result.pagination, 'Colleges retrieved successfully');
});

// Get college by ID
export const getCollegeByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const college = await getCollegeById(id);

  sendSuccess(res, college, 'College retrieved successfully');
});

// Create new college
export const createCollegeController = asyncHandler(async (req: Request, res: Response) => {
  const collegeData: CreateCollegeInput = createCollegeSchema.parse(req.body);
  const createdBy = req.user?.id; // Optional - might be created by system

  const college = await createCollege(collegeData, createdBy);

  sendSuccess(res, college, 'College created successfully', 201);
});

// Update college
export const updateCollegeController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const collegeData: UpdateCollegeInput = updateCollegeSchema.parse(req.body);

  const college = await updateCollege(id, collegeData);

  sendSuccess(res, college, 'College updated successfully');
});

// Delete college
export const deleteCollegeController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteCollege(id);

  sendSuccess(res, result, 'College deleted successfully');
});

// Assign trainer to college
export const assignTrainerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { trainerId } = req.body;

  const assignment = await assignTrainerToCollege(id, trainerId);

  sendSuccess(res, assignment, 'Trainer assigned to college successfully');
});

// Get college statistics
export const getCollegeStatsController = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getCollegeStats();

  sendSuccess(res, stats, 'College statistics retrieved successfully');
});

// Get colleges by status
export const getCollegesByStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params;

  const colleges = await getCollegesByStatus(status);

  sendSuccess(res, colleges, `${status} colleges retrieved successfully`);
});