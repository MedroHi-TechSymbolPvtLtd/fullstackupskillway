import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import { prisma } from '../config/database';
import {
  getAvailableTrainers,
  assignTrainerToCollege,
  unassignTrainerFromCollege,
  getCollegeTrainerAssignments,
  getCollegeWithTrainer,
  getTrainerAssignmentStats,
} from '../services/collegeTrainerService';
import { 
  AssignTrainerToCollegeInput, 
  UnassignTrainerFromCollegeInput,
  AvailableTrainersQueryInput,
  CollegeTrainerQueryInput 
} from '../validators/collegeTrainer';

/**
 * College-Trainer Assignment controller
 * Handles trainer assignment to colleges with role-based access
 */

// Get available trainers for assignment
export const getAvailableTrainersController = asyncHandler(async (req: Request, res: Response) => {
  const queryParams: AvailableTrainersQueryInput = req.query as any;

  const result = await getAvailableTrainers(queryParams);

  sendPaginated(res, result.trainers, result.pagination, 'Available trainers retrieved successfully');
});

// Assign trainer to college
export const assignTrainerToCollegeController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignmentData: AssignTrainerToCollegeInput = req.body;
  const assignedBy = req.user!.id;

  const college = await assignTrainerToCollege(id, assignmentData, assignedBy);

  sendSuccess(res, college, 'Trainer assigned to college successfully');
});

// Unassign trainer from college
export const unassignTrainerFromCollegeController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const unassignmentData: UnassignTrainerFromCollegeInput = req.body;
  const unassignedBy = req.user!.id;

  const college = await unassignTrainerFromCollege(id, unassignmentData, unassignedBy);

  sendSuccess(res, college, 'Trainer unassigned from college successfully');
});

// Get college trainer assignments
export const getCollegeTrainerAssignmentsController = asyncHandler(async (req: Request, res: Response) => {
  const queryParams: CollegeTrainerQueryInput = req.query as any;

  const result = await getCollegeTrainerAssignments(queryParams);

  sendPaginated(res, result.assignments, result.pagination, 'College trainer assignments retrieved successfully');
});

// Get college with assigned trainer details
export const getCollegeWithTrainerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const college = await getCollegeWithTrainer(id);

  sendSuccess(res, college, 'College with trainer details retrieved successfully');
});

// Get trainer assignment statistics
export const getTrainerAssignmentStatsController = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getTrainerAssignmentStats();

  sendSuccess(res, stats, 'Trainer assignment statistics retrieved successfully');
});

// Get trainer's assigned colleges
export const getTrainerAssignedCollegesController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where: { assignedTrainer: id },
        skip,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          status: true,
          lastTrainingAt: true,
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { lastTrainingAt: 'desc' },
      }),
      prisma.college.count({
        where: { assignedTrainer: id },
      }),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      hasNext: Number(page) < Math.ceil(total / Number(limit)),
      hasPrev: Number(page) > 1,
    };

    sendPaginated(res, colleges, pagination, 'Trainer assigned colleges retrieved successfully');
  } catch (error) {
    throw error;
  }
});

// Get college's trainer assignment history
export const getCollegeTrainerHistoryController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);

    const [history, total] = await Promise.all([
      prisma.collegeTrainer.findMany({
        where: { collegeId: id },
        skip,
        take: Number(limit),
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
              email: true,
              specialization: true,
              experience: true,
              rating: true,
            },
          },
        },
        orderBy: { assignedAt: 'desc' },
      }),
      prisma.collegeTrainer.count({
        where: { collegeId: id },
      }),
    ]);

    const pagination = {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
      hasNext: Number(page) < Math.ceil(total / Number(limit)),
      hasPrev: Number(page) > 1,
    };

    sendPaginated(res, history, pagination, 'College trainer history retrieved successfully');
  } catch (error) {
    throw error;
  }
});
