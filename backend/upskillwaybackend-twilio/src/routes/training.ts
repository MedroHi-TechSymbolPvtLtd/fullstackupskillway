import express from 'express';
import { trainingController } from '../controllers/trainingController';
import { authenticate, requireAuth } from '../middlewares/auth';
import {
  createTrainingValidator,
  updateTrainingValidator,
  deleteTrainingValidator,
  getTrainingByIdValidator,
  getTrainingsValidator,
} from '../validators/training';

const router = express.Router();

// Public routes
router.get('/', getTrainingsValidator, trainingController.getTrainings);
router.get('/:id', getTrainingByIdValidator, trainingController.getTrainingById);

// Protected routes (Admin only)
router.post('/', authenticate, requireAuth, createTrainingValidator, trainingController.createTraining);
router.put('/:id', authenticate, requireAuth, updateTrainingValidator, trainingController.updateTraining);
router.delete('/:id', authenticate, requireAuth, deleteTrainingValidator, trainingController.deleteTraining);

export default router;