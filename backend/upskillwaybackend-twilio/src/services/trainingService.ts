import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

export const trainingService = {
  // Create a new training
  async createTraining(data: any, userId: string) {
    try {
      // Check if slug already exists
      const existingTraining = await prisma.trainingProgram.findUnique({
        where: { slug: data.slug },
      });

      if (existingTraining) {
        throw new AppError('Slug already exists', 400);
      }

      return await prisma.trainingProgram.create({
        data: {
          ...data,
          createdBy: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  // Update an existing training
  async updateTraining(id: string, data: any) {
    try {
      // Check if training exists
      const training = await prisma.trainingProgram.findUnique({
        where: { id },
      });

      if (!training) {
        throw new AppError('Training not found', 404);
      }

      // Check if slug is being updated and already exists
      if (data.slug && data.slug !== training.slug) {
        const existingTraining = await prisma.trainingProgram.findUnique({
          where: { slug: data.slug },
        });

        if (existingTraining) {
          throw new AppError('Slug already exists', 400);
        }
      }

      return await prisma.trainingProgram.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete a training
  async deleteTraining(id: string) {
    try {
      // Check if training exists
      const training = await prisma.trainingProgram.findUnique({
        where: { id },
      });

      if (!training) {
        throw new AppError('Training not found', 404);
      }

      return await prisma.trainingProgram.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  },

  // Get all trainings with optional filter by trainingType
  async getTrainings(trainingType?: string) {
    try {
      const where = trainingType ? { trainingType: trainingType as any } : {};

      return await prisma.trainingProgram.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw error;
    }
  },

  // Get a single training by ID
  async getTrainingById(id: string) {
    try {
      const training = await prisma.trainingProgram.findUnique({
        where: { id },
      });

      if (!training) {
        throw new AppError('Training not found', 404);
      }

      return training;
    } catch (error) {
      throw error;
    }
  },
};