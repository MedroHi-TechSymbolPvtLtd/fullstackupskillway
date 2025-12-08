import { prisma } from '../config/database';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import {
  CreateTrainerBookingInput,
  AdminCreateTrainerBookingInput,
  UpdateTrainerBookingInput,
  UpdateTrainerStatusInput,
  TrainerBookingQueryInput,
  TrainerAvailabilityQueryInput
} from '../validators/trainerBooking';
import { TrainerStatus, BookingStatus } from '@prisma/client';

/**
 * Trainer booking service
 * Handles trainer availability and booking operations
 */

// Check trainer availability for a specific time range
export const checkTrainerAvailability = async (queryParams: TrainerAvailabilityQueryInput) => {
  try {
    const { trainerId, startTime, endTime } = queryParams;

    // Get trainer details
    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    // Check if trainer is available (not NOT_AVAILABLE or INACTIVE)
    if (trainer.status === 'NOT_AVAILABLE' || trainer.status === 'INACTIVE') {
      return {
        isAvailable: false,
        reason: `Trainer is ${trainer.status.toLowerCase().replace('_', ' ')}`,
        trainer: trainer,
      };
    }

    // Check for overlapping bookings
    const overlappingBookings = await prisma.trainerBooking.findMany({
      where: {
        trainerId,
        status: 'ACTIVE',
        OR: [
          // Booking starts within the requested time range
          {
            AND: [
              { startTime: { gte: new Date(startTime) } },
              { startTime: { lt: new Date(endTime) } },
            ],
          },
          // Booking ends within the requested time range
          {
            AND: [
              { endTime: { gt: new Date(startTime) } },
              { endTime: { lte: new Date(endTime) } },
            ],
          },
          // Booking completely contains the requested time range
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
      },
    });

    if (overlappingBookings.length > 0) {
      return {
        isAvailable: false,
        reason: 'Trainer has overlapping bookings',
        overlappingBookings,
        trainer: trainer,
      };
    }

    return {
      isAvailable: true,
      reason: 'Trainer is available',
      trainer: trainer,
    };
  } catch (error) {
    logger.error('Check trainer availability failed', error);
    throw error;
  }
};

// Create trainer booking
export const createTrainerBooking = async (bookingData: CreateTrainerBookingInput | AdminCreateTrainerBookingInput, bookedBy?: string) => {
  try {
    const { trainerId, collegeId, collegeName, startTime, endTime, title, description } = bookingData as any;

    // Check trainer availability first
    const availability = await checkTrainerAvailability({
      trainerId,
      startTime,
      endTime,
    });

    if (!availability.isAvailable) {
      throw new ConflictError(`Cannot book trainer: ${availability.reason}`);
    }

    let finalCollegeId = collegeId;
    let finalBookedBy = bookedBy;

    // If collegeName is provided, look up the college by name
    if (collegeName && !collegeId) {
      const college = await prisma.college.findFirst({
        where: {
          name: {
            contains: collegeName,
            mode: 'insensitive', // Case-insensitive search
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      if (!college) {
        throw new BadRequestError(`College with name "${collegeName}" not found`);
      }

      finalCollegeId = college.id;
      logger.info(`College name "${collegeName}" resolved to ID: ${finalCollegeId}`);
    }

    // If collegeId is provided (either directly or resolved from name), verify the college exists
    // For admin bookings, we don't require pre-existing trainer-college assignments
    if (finalCollegeId) {
      const college = await prisma.college.findUnique({
        where: { id: finalCollegeId },
        select: {
          id: true,
          name: true,
          location: true,
        },
      });

      if (!college) {
        throw new BadRequestError(`College with ID "${finalCollegeId}" not found`);
      }

      logger.info(`College found: ${college.name} (${college.location})`);

      // Check if trainer is already assigned to this college (optional check)
      const collegeTrainerAssignment = await prisma.collegeTrainer.findFirst({
        where: {
          collegeId: finalCollegeId,
          trainerId,
          status: 'active',
        },
      });

      if (collegeTrainerAssignment) {
        logger.info(`Trainer ${trainerId} is already assigned to college: ${college.name}`);
      } else {
        logger.info(`Trainer ${trainerId} is not pre-assigned to college: ${college.name}, but admin booking is allowed`);
      }
    }

    // Validate bookedBy user exists if provided
    if (finalBookedBy) {
      const userExists = await prisma.user.findUnique({
        where: { id: finalBookedBy },
        select: { id: true },
      });

      if (!userExists) {
        logger.warn(`User with ID ${finalBookedBy} not found, setting bookedBy to null`);
        finalBookedBy = undefined;
      }
    }

    // Use transaction to create booking and update trainer status
    const result = await prisma.$transaction(async (tx) => {
      // Create the booking
      const booking = await tx.trainerBooking.create({
        data: {
          trainerId,
          collegeId: finalCollegeId || null, // Include college assignment
          bookedBy: finalBookedBy || null, // Make bookedBy optional and safe
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          title,
          description,
        },
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          bookedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          college: finalCollegeId ? {
            select: {
              id: true,
              name: true,
              location: true,
            },
          } : undefined,
        },
      });

      // Update trainer status to BOOKED
      await tx.trainer.update({
        where: { id: trainerId },
        data: {
          status: 'BOOKED',
        },
      });

      return booking;
    });

    logger.info(`Trainer booking created: ${result.id} for trainer ${trainerId}${finalCollegeId ? ` assigned to college ${finalCollegeId}` : ''}`);

    return result;
  } catch (error) {
    logger.error('Create trainer booking failed', error);
    throw error;
  }
};

// Get all trainer bookings with filters
export const getAllTrainerBookings = async (queryParams: TrainerBookingQueryInput) => {
  try {
    const { page, limit, trainerId, collegeId, collegeName, status, startDate, endDate } = queryParams;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (trainerId) where.trainerId = trainerId;
    if (collegeId) where.collegeId = collegeId;
    if (status) where.status = status;

    // Handle college name filtering
    if (collegeName && !collegeId) {
      where.college = {
        name: {
          contains: collegeName,
          mode: 'insensitive',
        },
      };
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const [bookings, total] = await Promise.all([
      prisma.trainerBooking.findMany({
        where,
        skip,
        take: limit,
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
              email: true,
              specialization: true,
            },
          },
          bookedByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          college: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: { startTime: 'desc' },
      }),
      prisma.trainerBooking.count({ where }),
    ]);

    return {
      bookings,
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
    logger.error('Get all trainer bookings failed', error);
    throw error;
  }
};

// Get trainer booking by ID
export const getTrainerBookingById = async (bookingId: string) => {
  try {
    const booking = await prisma.trainerBooking.findUnique({
      where: { id: bookingId },
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            specialization: true,
            location: true,
          },
        },
        bookedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundError('Trainer booking not found');
    }

    return booking;
  } catch (error) {
    logger.error(`Get trainer booking failed: ${bookingId}`, error);
    throw error;
  }
};

// Update trainer booking
export const updateTrainerBooking = async (bookingId: string, bookingData: UpdateTrainerBookingInput) => {
  try {
    const existingBooking = await prisma.trainerBooking.findUnique({
      where: { id: bookingId },
      include: { trainer: true },
    });

    if (!existingBooking) {
      throw new NotFoundError('Trainer booking not found');
    }

    // If updating time, check for conflicts
    if (bookingData.startTime || bookingData.endTime) {
      const startTime = bookingData.startTime || existingBooking.startTime.toISOString();
      const endTime = bookingData.endTime || existingBooking.endTime.toISOString();

      const availability = await checkTrainerAvailability({
        trainerId: existingBooking.trainerId,
        startTime,
        endTime,
      });

      // Filter out the current booking from conflicts
      const hasConflicts = availability.overlappingBookings?.some(
        booking => booking.id !== bookingId
      );

      if (hasConflicts) {
        throw new ConflictError('Cannot update booking: time conflicts with existing bookings');
      }
    }

    const booking = await prisma.trainerBooking.update({
      where: { id: bookingId },
      data: {
        ...bookingData,
        startTime: bookingData.startTime ? new Date(bookingData.startTime) : undefined,
        endTime: bookingData.endTime ? new Date(bookingData.endTime) : undefined,
      },
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        bookedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Trainer booking updated: ${booking.id}`);

    return booking;
  } catch (error) {
    logger.error(`Update trainer booking failed: ${bookingId}`, error);
    throw error;
  }
};

// Cancel trainer booking
export const cancelTrainerBooking = async (bookingId: string) => {
  try {
    const booking = await prisma.trainerBooking.findUnique({
      where: { id: bookingId },
      include: { trainer: true },
    });

    if (!booking) {
      throw new NotFoundError('Trainer booking not found');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestError('Booking is already cancelled');
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update booking status to cancelled
      const updatedBooking = await tx.trainerBooking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
            },
          },
          bookedByUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Check if trainer has any other active bookings
      const activeBookings = await tx.trainerBooking.count({
        where: {
          trainerId: booking.trainerId,
          status: 'ACTIVE',
          id: { not: bookingId },
        },
      });

      // If no active bookings, set trainer status back to AVAILABLE
      if (activeBookings === 0) {
        await tx.trainer.update({
          where: { id: booking.trainerId },
          data: {
            status: 'AVAILABLE',
          },
        });
      }

      return updatedBooking;
    });

    logger.info(`Trainer booking cancelled: ${bookingId}`);

    return result;
  } catch (error) {
    logger.error(`Cancel trainer booking failed: ${bookingId}`, error);
    throw error;
  }
};

// Update trainer status manually
export const updateTrainerStatus = async (trainerId: string, statusData: UpdateTrainerStatusInput) => {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
    });

    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    const { status, notes } = statusData;

    // If setting to AVAILABLE, check for active bookings
    if (status === 'AVAILABLE') {
      const activeBookings = await prisma.trainerBooking.count({
        where: {
          trainerId,
          status: 'ACTIVE',
        },
      });

      if (activeBookings > 0) {
        throw new ConflictError('Cannot set trainer to AVAILABLE while having active bookings');
      }
    }

    const updatedTrainer = await prisma.trainer.update({
      where: { id: trainerId },
      data: {
        status,
        ...(notes && { notes }),
      },
      include: {
        bookings: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    logger.info(`Trainer status updated: ${trainerId} - Status: ${status}`);

    return updatedTrainer;
  } catch (error) {
    logger.error(`Update trainer status failed: ${trainerId}`, error);
    throw error;
  }
};

// Get trainer availability calendar
export const getTrainerAvailabilityCalendar = async (trainerId: string, startDate: string, endDate: string) => {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { id: trainerId },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!trainer) {
      throw new NotFoundError('Trainer not found');
    }

    const bookings = await prisma.trainerBooking.findMany({
      where: {
        trainerId,
        status: 'ACTIVE',
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        description: true,
      },
      orderBy: { startTime: 'asc' },
    });

    return {
      trainer: {
        id: trainer.id,
        name: trainer.name,
        status: trainer.status,
      },
      bookings,
      availability: trainer.status === 'AVAILABLE' ? 'available' : 'unavailable',
    };
  } catch (error) {
    logger.error(`Get trainer availability calendar failed: ${trainerId}`, error);
    throw error;
  }
};

// Auto-update expired bookings (can be called by a cron job)
export const updateExpiredBookings = async () => {
  try {
    const now = new Date();

    const expiredBookings = await prisma.trainerBooking.findMany({
      where: {
        status: 'ACTIVE',
        endTime: { lt: now },
      },
      include: { trainer: true },
    });

    for (const booking of expiredBookings) {
      await prisma.$transaction(async (tx) => {
        // Mark booking as completed
        await tx.trainerBooking.update({
          where: { id: booking.id },
          data: { status: 'COMPLETED' },
        });

        // Check if trainer has any other active bookings
        const activeBookings = await tx.trainerBooking.count({
          where: {
            trainerId: booking.trainerId,
            status: 'ACTIVE',
          },
        });

        // If no active bookings, set trainer status back to AVAILABLE
        if (activeBookings === 0) {
          await tx.trainer.update({
            where: { id: booking.trainerId },
            data: {
              status: 'AVAILABLE',
            },
          });
        }
      });
    }

    logger.info(`Updated ${expiredBookings.length} expired bookings`);

    return { updatedCount: expiredBookings.length };
  } catch (error) {
    logger.error('Update expired bookings failed', error);
    throw error;
  }
};