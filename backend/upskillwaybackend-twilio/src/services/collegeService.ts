import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { logger } from '../utils/logger';
import { CollegeType, CollegeStatus } from '@prisma/client';
import { CreateCollegeInput, UpdateCollegeInput } from '../validators/college';

interface CollegeFilters {
  search?: string;
  status?: CollegeStatus;
  type?: CollegeType;
  assignedTo?: string;
}

// Removed interface - using validator types instead

// Get all colleges with filters
export const getAllColleges = async (page: number, limit: number, filters: CollegeFilters) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { contactPerson: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.type) {
      where.type = filters.type;
    }
    
    if (filters.assignedTo) {
      where.assignedToId = filters.assignedTo;
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          trainers: {
            include: {
              trainer: {
                select: {
                  id: true,
                  name: true,
                  specialization: true,
                  rating: true,
                },
              },
            },
          },
          _count: {
            select: {
              leads: true,
              trainings: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.college.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      colleges,
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
    logger.error('Get all colleges failed', error);
    throw error;
  }
};

// Get college by ID
export const getCollegeById = async (collegeId: string) => {
  try {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        leads: {
          select: {
            id: true,
            name: true,
            email: true,
            stage: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        trainers: {
          include: {
            trainer: {
              select: {
                id: true,
                name: true,
                email: true,
                specialization: true,
                rating: true,
                status: true,
              },
            },
          },
        },
        trainings: {
          include: {
            trainer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    if (!college) {
      throw new NotFoundError('College not found');
    }

    return college;
  } catch (error) {
    logger.error(`Get college failed: ${collegeId}`, error);
    throw error;
  }
};

// Create new college
export const createCollege = async (collegeData: CreateCollegeInput, createdBy?: string) => {
  try {
    // Check if college with same name already exists (location might be optional)
    const existingCollege = await prisma.college.findFirst({
      where: {
        name: collegeData.name,
        ...(collegeData.location && { location: collegeData.location }),
      },
    });

    if (existingCollege) {
      throw new ConflictError('College with this name already exists');
    }

    // assignedToId is now optional - can be null during creation
    // Verify assignedToId only if provided
    if (collegeData.assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: collegeData.assignedToId },
        select: { id: true },
      });

      if (!assignedUser) {
        throw new NotFoundError('Assigned user not found');
      }
    }

    const college = await prisma.college.create({
      data: collegeData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`College created: ${college.name}`);
    return college;
  } catch (error) {
    logger.error('Create college failed', error);
    throw error;
  }
};

// Update college
export const updateCollege = async (collegeId: string, collegeData: UpdateCollegeInput) => {
  try {
    const existingCollege = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!existingCollege) {
      throw new NotFoundError('College not found');
    }

    const college = await prisma.college.update({
      where: { id: collegeId },
      data: collegeData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`College updated: ${college.name}`);
    return college;
  } catch (error) {
    logger.error(`Update college failed: ${collegeId}`, error);
    throw error;
  }
};

// Delete college
export const deleteCollege = async (collegeId: string) => {
  try {
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      throw new NotFoundError('College not found');
    }

    await prisma.college.delete({ where: { id: collegeId } });

    logger.info(`College deleted: ${college.name}`);
    return { message: 'College deleted successfully' };
  } catch (error) {
    logger.error(`Delete college failed: ${collegeId}`, error);
    throw error;
  }
};

// Assign trainer to college
export const assignTrainerToCollege = async (collegeId: string, trainerId: string) => {
  try {
    const [college, trainer] = await Promise.all([
      prisma.college.findUnique({ where: { id: collegeId } }),
      prisma.trainer.findUnique({ where: { id: trainerId } }),
    ]);

    if (!college) {
      throw new NotFoundError('College not found');
    }

    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.collegeTrainer.findUnique({
      where: {
        collegeId_trainerId: {
          collegeId,
          trainerId,
        },
      },
    });

    if (existingAssignment) {
      throw new ConflictError('Trainer already assigned to this college');
    }

    const assignment = await prisma.collegeTrainer.create({
      data: {
        collegeId,
        trainerId,
      },
      include: {
        college: {
          select: {
            id: true,
            name: true,
          },
        },
        trainer: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
    });

    logger.info(`Trainer ${trainer.name} assigned to college ${college.name}`);
    return assignment;
  } catch (error) {
    logger.error(`Assign trainer to college failed: ${collegeId}, ${trainerId}`, error);
    throw error;
  }
};

// Get college statistics
export const getCollegeStats = async () => {
  try {
    const [
      totalColleges,
      activePartners,
      totalRevenue,
      avgRating,
      collegesByStatus,
      collegesByType,
    ] = await Promise.all([
      prisma.college.count(),
      prisma.college.count({ where: { status: 'ACTIVE' } }),
      prisma.college.aggregate({
        _sum: { totalRevenue: true },
      }),
      prisma.college.aggregate({
        _avg: { avgRating: true },
      }),
      prisma.college.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.college.groupBy({
        by: ['type'],
        _count: true,
      }),
    ]);

    return {
      totalColleges,
      activePartners,
      totalRevenue: totalRevenue._sum.totalRevenue || 0,
      avgRating: avgRating._avg.avgRating || 0,
      collegesByStatus,
      collegesByType,
    };
  } catch (error) {
    logger.error('Get college stats failed', error);
    throw error;
  }
};

// Get colleges by status
export const getCollegesByStatus = async (status: string) => {
  try {
    const colleges = await prisma.college.findMany({
      where: { status: status as any },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            leads: true,
            trainings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return colleges;
  } catch (error) {
    logger.error(`Get colleges by status failed: ${status}`, error);
    throw error;
  }
};