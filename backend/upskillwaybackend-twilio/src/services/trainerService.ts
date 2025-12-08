import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';
import { TrainerStatus, TrainingMode } from '@prisma/client';
import { CreateTrainerInput, UpdateTrainerInput } from '../validators/trainer';

interface TrainerFilters {
  search?: string;
  status?: TrainerStatus;
  specialization?: string;
}

// Removed interface - using validator types instead

interface AvailabilityFilters {
  specialization?: string;
  mode?: string;
  date?: Date;
}

// Get all trainers with filters
export const getAllTrainers = async (page: number, limit: number, filters: TrainerFilters) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { specialization: { hasSome: [filters.search] } },
      ];
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.specialization) {
      where.specialization = { has: filters.specialization };
    }

    const [trainers, total] = await Promise.all([
      prisma.trainer.findMany({
        where,
        skip,
        take: limit,
        include: {
          colleges: {
            include: {
              college: {
                select: {
                  id: true,
                  name: true,
                  location: true,
                },
              },
            },
          },
          _count: {
            select: {
              trainings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.trainer.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      trainers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Get all trainers failed', error);
    throw error;
  }
};

// Get trainer by ID
export const getTrainerById = async (trainerId: string) => {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
      include: {
        colleges: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                location: true,
                status: true,
              },
            },
          },
        },
        trainings: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                location: true,
              },
            },
          },
          orderBy: { startDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    return trainer;
  } catch (error) {
    logger.error(`Get trainer failed: ${trainerId}`, error);
    throw error;
  }
};

// Create new trainer
export const createTrainer = async (trainerData: CreateTrainerInput) => {
  try {
    // Check if trainer with same email already exists
    const existingTrainer = await prisma.trainer.findUnique({
      where: { email: trainerData.email },
    });

    if (existingTrainer) {
      throw new ConflictError('Trainer with this email already exists');
    }

    const trainer = await prisma.trainer.create({
      data: trainerData,
    });

    logger.info(`Trainer created: ${trainer.name}`);
    return trainer;
  } catch (error) {
    logger.error('Create trainer failed', error);
    throw error;
  }
};

// Update trainer
export const updateTrainer = async (trainerId: string, trainerData: UpdateTrainerInput) => {
  try {
    const existingTrainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
    if (!existingTrainer) {
      throw new NotFoundError('Trainer not found');
    }

    // Check email uniqueness if email is being updated
    if (trainerData.email && trainerData.email !== existingTrainer.email) {
      const emailExists = await prisma.trainer.findUnique({
        where: { email: trainerData.email },
      });
      if (emailExists) {
        throw new ConflictError('Trainer with this email already exists');
      }
    }

    const trainer = await prisma.trainer.update({
      where: { id: trainerId },
      data: trainerData,
    });

    logger.info(`Trainer updated: ${trainer.name}`);
    return trainer;
  } catch (error) {
    logger.error(`Update trainer failed: ${trainerId}`, error);
    throw error;
  }
};

// Delete trainer
export const deleteTrainer = async (trainerId: string) => {
  try {
    const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    // Check if trainer has active trainings
    const activeTrainings = await prisma.training.count({
      where: {
        trainerId,
        status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
      },
    });

    if (activeTrainings > 0) {
      throw new ConflictError('Cannot delete trainer with active trainings');
    }

    await prisma.trainer.delete({ where: { id: trainerId } });

    logger.info(`Trainer deleted: ${trainer.name}`);
    return { message: 'Trainer deleted successfully' };
  } catch (error) {
    logger.error(`Delete trainer failed: ${trainerId}`, error);
    throw error;
  }
};

// Get available trainers
export const getAvailableTrainers = async (filters: AvailabilityFilters) => {
  try {
    const where: any = {
      status: 'AVAILABLE',
    };

    if (filters.specialization) {
      where.specialization = { has: filters.specialization };
    }

    if (filters.mode) {
      where.trainingMode = { has: filters.mode };
    }

    if (filters.date) {
      where.OR = [
        { nextSlot: null },
        { nextSlot: { lte: filters.date } },
      ];
    }

    const trainers = await prisma.trainer.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
        experience: true,
        rating: true,
        nextSlot: true,
        location: true,
        trainingMode: true,
        languages: true,
        feedbackScore: true,
        totalSessions: true,
      },
      orderBy: [
        { rating: 'desc' },
        { experience: 'desc' },
      ],
    });

    return trainers;
  } catch (error) {
    logger.error('Get available trainers failed', error);
    throw error;
  }
};

// Update trainer status
export const updateTrainerStatus = async (
  trainerId: string,
  status: TrainerStatus,
  nextSlot?: Date
) => {
  try {
    const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    const updatedTrainer = await prisma.trainer.update({
      where: { id: trainerId },
      data: {
        status,
        nextSlot,
      },
    });

    logger.info(`Trainer status updated: ${trainer.name} - ${status}`);
    return updatedTrainer;
  } catch (error) {
    logger.error(`Update trainer status failed: ${trainerId}`, error);
    throw error;
  }
};

// Get trainer statistics
export const getTrainerStats = async () => {
  try {
    const [
      totalTrainers,
      activeTrainers,
      avgRating,
      totalSessions,
      trainersByStatus,
      trainersBySpecialization,
      topRatedTrainers,
    ] = await Promise.all([
      prisma.trainer.count(),
      prisma.trainer.count({ where: { status: 'AVAILABLE' } }),
      prisma.trainer.aggregate({
        _avg: { rating: true },
      }),
      prisma.trainer.aggregate({
        _sum: { totalSessions: true },
      }),
      prisma.trainer.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.trainer.groupBy({
        by: ['specialization'],
        _count: true,
      }),
      prisma.trainer.findMany({
        where: { rating: { gte: 4.0 } },
        select: {
          id: true,
          name: true,
          rating: true,
          totalSessions: true,
          specialization: true,
        },
        orderBy: { rating: 'desc' },
        take: 5,
      }),
    ]);

    return {
      totalTrainers,
      activeTrainers,
      avgRating: avgRating._avg.rating || 0,
      totalSessions: totalSessions._sum.totalSessions || 0,
      trainersByStatus,
      trainersBySpecialization,
      topRatedTrainers,
    };
  } catch (error) {
    logger.error('Get trainer stats failed', error);
    throw error;
  }
};