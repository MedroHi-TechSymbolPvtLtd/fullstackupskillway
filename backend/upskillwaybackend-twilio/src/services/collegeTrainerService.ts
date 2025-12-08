import { prisma } from '../config/database';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import { 
  AssignTrainerToCollegeInput, 
  UnassignTrainerFromCollegeInput,
  AvailableTrainersQueryInput,
  CollegeTrainerQueryInput 
} from '../validators/collegeTrainer';

/**
 * College-Trainer Assignment service
 * Handles trainer assignment to colleges with automatic status updates
 */

// Get available trainers for assignment
export const getAvailableTrainers = async (queryParams: AvailableTrainersQueryInput) => {
  try {
    const { page, limit, specialization, location, experience } = queryParams;
    const skip = (page - 1) * limit;
    
    const where: any = {
      status: 'AVAILABLE',
    };
    
    if (specialization) {
      where.specialization = {
        has: specialization,
      };
    }
    
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      };
    }
    
    if (experience !== undefined) {
      where.experience = {
        gte: experience,
      };
    }

    const [trainers, total] = await Promise.all([
      prisma.trainer.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          specialization: true,
          experience: true,
          rating: true,
          location: true,
          trainingMode: true,
          languages: true,
          status: true,
          totalSessions: true,
          feedbackScore: true,
        },
        orderBy: { rating: 'desc' },
      }),
      prisma.trainer.count({ where }),
    ]);

    return {
      trainers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Get available trainers failed', error);
    throw error;
  }
};

// Assign trainer to college
export const assignTrainerToCollege = async (collegeId: string, assignmentData: AssignTrainerToCollegeInput, assignedBy: string) => {
  try {
    const { trainerId, notes } = assignmentData;

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        assignedTrainerDetails: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!college) {
      throw new NotFoundError('College not found');
    }

    // Check if college already has a trainer assigned
    if (college.assignedTrainer) {
      throw new ConflictError(`College already has trainer assigned: ${college.assignedTrainerDetails?.name}`);
    }

    // Check if trainer exists and is available
    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
      include: {
        assignedColleges: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    if (trainer.status !== 'AVAILABLE') {
      throw new ConflictError(`Trainer is not available. Current status: ${trainer.status}`);
    }

    // Use transaction to assign trainer and update status
    const result = await prisma.$transaction(async (tx) => {
      // Update college with assigned trainer
      const updatedCollege = await tx.college.update({
        where: { id: collegeId },
        data: {
          assignedTrainer: trainerId,
          lastTrainingAt: new Date(),
        },
        include: {
          assignedTrainerDetails: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              specialization: true,
              experience: true,
              rating: true,
              location: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Update trainer status to BOOKED
      await tx.trainer.update({
        where: { id: trainerId },
        data: {
          status: 'BOOKED',
        },
      });

      // Create assignment record in CollegeTrainer table
      await tx.collegeTrainer.create({
        data: {
          collegeId,
          trainerId,
          status: 'active',
        },
      });

      return updatedCollege;
    });

    logger.info(`Trainer assigned to college: ${trainer.name} → ${college.name}`);

    return result;
  } catch (error) {
    logger.error(`Assign trainer to college failed: ${collegeId}`, error);
    throw error;
  }
};

// Unassign trainer from college
export const unassignTrainerFromCollege = async (collegeId: string, unassignmentData: UnassignTrainerFromCollegeInput, unassignedBy: string) => {
  try {
    const { notes } = unassignmentData;

    // Check if college exists and has trainer assigned
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        assignedTrainerDetails: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!college) {
      throw new NotFoundError('College not found');
    }

    if (!college.assignedTrainer) {
      throw new BadRequestError('College does not have a trainer assigned');
    }

    const trainerId = college.assignedTrainer;

    // Use transaction to unassign trainer and update status
    const result = await prisma.$transaction(async (tx) => {
      // Update college to remove assigned trainer
      const updatedCollege = await tx.college.update({
        where: { id: collegeId },
        data: {
          assignedTrainer: null,
        },
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

      // Check if trainer has any other active assignments
      const activeAssignments = await tx.college.count({
        where: {
          assignedTrainer: trainerId,
          id: { not: collegeId },
        },
      });

      // Check if trainer has any active bookings
      const activeBookings = await tx.trainerBooking.count({
        where: {
          trainerId,
          status: 'ACTIVE',
        },
      });

      // If no active assignments or bookings, set trainer status back to AVAILABLE
      if (activeAssignments === 0 && activeBookings === 0) {
        await tx.trainer.update({
          where: { id: trainerId },
          data: {
            status: 'AVAILABLE',
          },
        });
      }

      // Update CollegeTrainer record
      await tx.collegeTrainer.updateMany({
        where: {
          collegeId,
          trainerId,
        },
        data: {
          status: 'inactive',
        },
      });

      return updatedCollege;
    });

    logger.info(`Trainer unassigned from college: ${college.assignedTrainerDetails?.name} ← ${college.name}`);

    return result;
  } catch (error) {
    logger.error(`Unassign trainer from college failed: ${collegeId}`, error);
    throw error;
  }
};

// Get college trainer assignments
export const getCollegeTrainerAssignments = async (queryParams: CollegeTrainerQueryInput) => {
  try {
    const { page, limit, collegeId, trainerId, status } = queryParams;
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (collegeId) where.collegeId = collegeId;
    if (trainerId) where.trainerId = trainerId;
    if (status) where.status = status;

    const [assignments, total] = await Promise.all([
      prisma.collegeTrainer.findMany({
        where,
        skip,
        take: limit,
        include: {
          college: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
              status: true,
            },
          },
          trainer: {
            select: {
              id: true,
              name: true,
              email: true,
              specialization: true,
              experience: true,
              rating: true,
              location: true,
            },
          },
        },
        orderBy: { assignedAt: 'desc' },
      }),
      prisma.collegeTrainer.count({ where }),
    ]);

    return {
      assignments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Get college trainer assignments failed', error);
    throw error;
  }
};

// Get college with assigned trainer details
export const getCollegeWithTrainer = async (collegeId: string) => {
  try {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        assignedTrainerDetails: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            specialization: true,
            experience: true,
            rating: true,
            location: true,
            trainingMode: true,
            languages: true,
            status: true,
            totalSessions: true,
            feedbackScore: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        trainers: {
          where: { status: 'active' },
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
        },
        trainings: {
          take: 5,
          orderBy: { startDate: 'desc' },
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!college) {
      throw new NotFoundError('College not found');
    }

    return college;
  } catch (error) {
    logger.error(`Get college with trainer failed: ${collegeId}`, error);
    throw error;
  }
};

// Get trainer assignment statistics
export const getTrainerAssignmentStats = async () => {
  try {
    const [
      totalColleges,
      collegesWithTrainers,
      totalTrainers,
      availableTrainers,
      bookedTrainers,
      assignmentsByStatus,
    ] = await Promise.all([
      prisma.college.count(),
      prisma.college.count({
        where: {
          assignedTrainer: { not: null },
        },
      }),
      prisma.trainer.count(),
      prisma.trainer.count({
        where: { status: 'AVAILABLE' },
      }),
      prisma.trainer.count({
        where: { status: 'BOOKED' },
      }),
      prisma.collegeTrainer.groupBy({
        by: ['status'],
        _count: true,
        orderBy: { _count: { status: 'desc' } },
      }),
    ]);

    const assignmentRate = totalColleges > 0 ? (collegesWithTrainers / totalColleges) * 100 : 0;
    const trainerUtilization = totalTrainers > 0 ? (bookedTrainers / totalTrainers) * 100 : 0;

    return {
      totalColleges,
      collegesWithTrainers,
      collegesWithoutTrainers: totalColleges - collegesWithTrainers,
      assignmentRate: Math.round(assignmentRate * 100) / 100,
      totalTrainers,
      availableTrainers,
      bookedTrainers,
      trainerUtilization: Math.round(trainerUtilization * 100) / 100,
      assignmentsByStatus: assignmentsByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
    };
  } catch (error) {
    logger.error('Get trainer assignment stats failed', error);
    throw error;
  }
};
