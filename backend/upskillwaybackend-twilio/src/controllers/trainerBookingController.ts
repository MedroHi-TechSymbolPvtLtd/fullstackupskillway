import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import { prisma } from '../config/database';
import {
  createTrainerBooking,
  getAllTrainerBookings,
  getTrainerBookingById,
  updateTrainerBooking,
  cancelTrainerBooking,
  updateTrainerStatus,
  checkTrainerAvailability,
  getTrainerAvailabilityCalendar,
  updateExpiredBookings,
} from '../services/trainerBookingService';
import { 
  CreateTrainerBookingInput, 
  AdminCreateTrainerBookingInput,
  UpdateTrainerBookingInput, 
  UpdateTrainerStatusInput,
  TrainerBookingQueryInput,
  TrainerAvailabilityQueryInput 
} from '../validators/trainerBooking';

/**
 * Trainer booking controller
 * Handles trainer availability and booking operations with role-based access
 */

// Check trainer availability
export const checkTrainerAvailabilityController = asyncHandler(async (req: Request, res: Response) => {
  const queryParams: TrainerAvailabilityQueryInput = req.query as any;

  const availability = await checkTrainerAvailability(queryParams);

  sendSuccess(res, availability, 'Trainer availability checked successfully');
});

// Create trainer booking
export const createTrainerBookingController = asyncHandler(async (req: Request, res: Response) => {
  const bookingData: CreateTrainerBookingInput = req.body;
  const bookedBy = req.user?.id; // Make optional

  const booking = await createTrainerBooking(bookingData, bookedBy);

  sendSuccess(res, booking, 'Trainer booking created successfully', 201);
});

// Admin create trainer booking (with college assignment)
export const adminCreateTrainerBookingController = asyncHandler(async (req: Request, res: Response) => {
  const bookingData: AdminCreateTrainerBookingInput = req.body;
  const adminId = req.user!.id;

  // Use the provided bookedBy or default to admin
  const bookedBy = bookingData.bookedBy || adminId;

  const booking = await createTrainerBooking({
    ...bookingData,
    bookedBy,
  }, bookedBy);

  sendSuccess(res, booking, 'Trainer booking created successfully by admin', 201);
});

// Get all trainer bookings
export const getAllTrainerBookingsController = asyncHandler(async (req: Request, res: Response) => {
  const queryParams: TrainerBookingQueryInput = req.query as any;

  const result = await getAllTrainerBookings(queryParams);

  sendPaginated(res, result.bookings, result.pagination, 'Trainer bookings retrieved successfully');
});

// Get trainer booking by ID
export const getTrainerBookingByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await getTrainerBookingById(id);

  sendSuccess(res, booking, 'Trainer booking retrieved successfully');
});

// Update trainer booking
export const updateTrainerBookingController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const bookingData: UpdateTrainerBookingInput = req.body;

  const booking = await updateTrainerBooking(id, bookingData);

  sendSuccess(res, booking, 'Trainer booking updated successfully');
});

// Cancel trainer booking
export const cancelTrainerBookingController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await cancelTrainerBooking(id);

  sendSuccess(res, booking, 'Trainer booking cancelled successfully');
});

// Update trainer status manually
export const updateTrainerStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const statusData: UpdateTrainerStatusInput = req.body;

  const trainer = await updateTrainerStatus(id, statusData);

  sendSuccess(res, trainer, 'Trainer status updated successfully');
});

// Get trainer availability calendar
export const getTrainerAvailabilityCalendarController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Start date and end date are required',
    });
  }

  const calendar = await getTrainerAvailabilityCalendar(id, startDate as string, endDate as string);

  return sendSuccess(res, calendar, 'Trainer availability calendar retrieved successfully');
});

// Update expired bookings (admin only)
export const updateExpiredBookingsController = asyncHandler(async (req: Request, res: Response) => {
  const result = await updateExpiredBookings();

  sendSuccess(res, result, 'Expired bookings updated successfully');
});

// Get trainer booking statistics
export const getTrainerBookingStatsController = asyncHandler(async (req: Request, res: Response) => {
  try {
    const [
      totalBookings,
      activeBookings,
      cancelledBookings,
      completedBookings,
      bookingsByStatus,
      trainersByStatus,
    ] = await Promise.all([
      prisma.trainerBooking.count(),
      prisma.trainerBooking.count({ where: { status: 'ACTIVE' } }),
      prisma.trainerBooking.count({ where: { status: 'CANCELLED' } }),
      prisma.trainerBooking.count({ where: { status: 'COMPLETED' } }),
      prisma.trainerBooking.groupBy({
        by: ['status'],
        _count: true,
        orderBy: { _count: { status: 'desc' } },
      }),
      prisma.trainer.groupBy({
        by: ['status'],
        _count: true,
        orderBy: { _count: { status: 'desc' } },
      }),
    ]);

    const stats = {
      totalBookings,
      activeBookings,
      cancelledBookings,
      completedBookings,
      bookingsByStatus: bookingsByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
      trainersByStatus: trainersByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
    };

    sendSuccess(res, stats, 'Trainer booking statistics retrieved successfully');
  } catch (error) {
    throw error;
  }
});
