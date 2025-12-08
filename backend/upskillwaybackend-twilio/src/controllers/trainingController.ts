import { Request, Response } from 'express';
import { trainingService } from '../services/trainingService';
import { sendSuccess, sendError } from '../utils/response';

export const trainingController = {
  // Create a new training
  createTraining: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id || '';
      const training = await trainingService.createTraining(req.body, userId);
      return sendSuccess(res, training, 'Training created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  // Update training by ID
  updateTraining: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const training = await trainingService.updateTraining(id, req.body);
      return sendSuccess(res, training, 'Training updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  // Delete training by ID
  deleteTraining: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await trainingService.deleteTraining(id);
      return sendSuccess(res, null, 'Training deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  // Get all trainings with optional filter
  getTrainings: async (req: Request, res: Response) => {
    try {
      const { trainingType } = req.query;
      const trainings = await trainingService.getTrainings(trainingType as string | undefined);
      return sendSuccess(res, trainings, 'Trainings retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  },

  // Get training by ID
  getTrainingById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const training = await trainingService.getTrainingById(id);
      return sendSuccess(res, training, 'Training retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, error.statusCode || 500);
    }
  }
};