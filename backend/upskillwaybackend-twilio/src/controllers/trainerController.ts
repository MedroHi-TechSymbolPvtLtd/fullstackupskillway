import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  getTrainerStats,
  getAvailableTrainers,
  updateTrainerStatus,
} from '../services/trainerService';
import { 
  createTrainerSchema,
  updateTrainerSchema,
  trainerQuerySchema,
  CreateTrainerInput,
  UpdateTrainerInput 
} from '../validators/trainer';

/**
 * @swagger
 * components:
 *   schemas:
 *     Trainer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         specialization:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: integer
 *         rating:
 *           type: number
 *         totalSessions:
 *           type: integer
 *         availability:
 *           type: string
 *           enum: [AVAILABLE, NOT_AVAILABLE, BOOKED, INACTIVE]
 *         nextSlot:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         trainingMode:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ONLINE, OFFLINE, HYBRID]
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         feedbackScore:
 *           type: number
 *         status:
 *           type: string
 *           enum: [AVAILABLE, NOT_AVAILABLE, BOOKED, INACTIVE]
 */

// Get all trainers
export const getAllTrainersController = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, status, specialization } = trainerQuerySchema.parse(req.query);

  const result = await getAllTrainers(page, limit, {
    search,
    status,
    specialization,
  });

  sendPaginated(res, result.trainers, result.pagination, 'Trainers retrieved successfully');
});

// Get trainer by ID
export const getTrainerByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const trainer = await getTrainerById(id);

  sendSuccess(res, trainer, 'Trainer retrieved successfully');
});

// Create new trainer
export const createTrainerController = asyncHandler(async (req: Request, res: Response) => {
  const trainerData: CreateTrainerInput = createTrainerSchema.parse(req.body);

  const trainer = await createTrainer(trainerData);

  sendSuccess(res, trainer, 'Trainer created successfully', 201);
});

// Update trainer
export const updateTrainerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const trainerData: UpdateTrainerInput = updateTrainerSchema.parse(req.body);

  const trainer = await updateTrainer(id, trainerData);

  sendSuccess(res, trainer, 'Trainer updated successfully');
});

// Delete trainer
export const deleteTrainerController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteTrainer(id);

  sendSuccess(res, result, 'Trainer deleted successfully');
});

// Get available trainers
export const getAvailableTrainersController = asyncHandler(async (req: Request, res: Response) => {
  const { specialization, mode, date } = req.query;

  const trainers = await getAvailableTrainers({
    specialization: specialization as string,
    mode: mode as string,
    date: date ? new Date(date as string) : undefined,
  });

  sendSuccess(res, trainers, 'Available trainers retrieved successfully');
});

// Update trainer status
export const updateTrainerStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, nextSlot } = req.body;

  const trainer = await updateTrainerStatus(id, status, nextSlot);

  sendSuccess(res, trainer, 'Trainer status updated successfully');
});

// Get trainer statistics
export const getTrainerStatsController = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getTrainerStats();

  sendSuccess(res, stats, 'Trainer statistics retrieved successfully');
});