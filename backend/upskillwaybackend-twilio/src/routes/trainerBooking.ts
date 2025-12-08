import { Router } from 'express';
import {
  createTrainerBookingController,
  adminCreateTrainerBookingController,
  getAllTrainerBookingsController,
  getTrainerBookingByIdController,
  updateTrainerBookingController,
  cancelTrainerBookingController,
  updateTrainerStatusController,
  checkTrainerAvailabilityController,
  getTrainerAvailabilityCalendarController,
  updateExpiredBookingsController,
  getTrainerBookingStatsController,
} from '../controllers/trainerBookingController';
import { authenticate, requireAuth } from '../middlewares/auth';
import { validateSchemaMiddleware, validateQuery } from '../utils/validation';
import { 
  createTrainerBookingSchema, 
  adminCreateTrainerBookingSchema,
  updateTrainerBookingSchema, 
  updateTrainerStatusSchema,
  trainerBookingQuerySchema,
  trainerAvailabilityQuerySchema 
} from '../validators/trainerBooking';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainerBooking:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         trainerId:
 *           type: string
 *           format: uuid
 *         bookedBy:
 *           type: string
 *           format: uuid
 *         collegeId:
 *           type: string
 *           format: uuid
 *           description: Optional college assignment
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, COMPLETED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         trainer:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         bookedByUser:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         college:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             location:
 *               type: string
 *     CreateTrainerBooking:
 *       type: object
 *       required:
 *         - trainerId
 *         - startTime
 *         - endTime
 *         - title
 *       properties:
 *         trainerId:
 *           type: string
 *           format: uuid
 *         collegeId:
 *           type: string
 *           format: uuid
 *           description: Optional college assignment
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     UpdateTrainerBooking:
 *       type: object
 *       properties:
 *         collegeId:
 *           type: string
 *           format: uuid
 *           description: Optional college assignment
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, COMPLETED]
 *     UpdateTrainerStatus:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [AVAILABLE, NOT_AVAILABLE, BOOKED, INACTIVE]
 *         notes:
 *           type: string
 */

// All routes require authentication
router.use(authenticate, requireAuth);

/**
 * @swagger
 * /api/v1/trainer-bookings/availability:
 *   get:
 *     summary: Check trainer availability for a time range
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trainerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Trainer availability checked successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer not found
 */
router.get('/availability', validateQuery(trainerAvailabilityQuerySchema), checkTrainerAvailabilityController);

/**
 * @swagger
 * /api/v1/trainer-bookings:
 *   get:
 *     summary: Get all trainer bookings
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: collegeId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by college assignment
 *       - in: query
 *         name: collegeName
 *         schema:
 *           type: string
 *         description: Filter by college name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, COMPLETED]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Trainer bookings retrieved successfully
 *   post:
 *     summary: Create a new trainer booking
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTrainerBooking'
 *     responses:
 *       201:
 *         description: Trainer booking created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - Trainer not available
 */
router.get('/', validateQuery(trainerBookingQuerySchema), getAllTrainerBookingsController);
router.post('/', validateSchemaMiddleware(createTrainerBookingSchema), createTrainerBookingController);

/**
 * @swagger
 * /api/v1/trainer-bookings/admin:
 *   post:
 *     summary: Create trainer booking as admin (with college assignment)
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainerId
 *               - startTime
 *               - endTime
 *               - title
 *             properties:
 *               trainerId:
 *                 type: string
 *                 format: uuid
 *               collegeName:
 *                 type: string
 *                 description: College name (alternative to collegeId)
 *               collegeId:
 *                 type: string
 *                 format: uuid
 *                 description: College UUID (alternative to collegeName)
 *               bookedBy:
 *                 type: string
 *                 format: uuid
 *                 description: Optional user to assign booking to (defaults to admin)
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, CANCELLED, COMPLETED]
 *                 default: ACTIVE
 *     responses:
 *       201:
 *         description: Trainer booking created successfully by admin
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Conflict - Trainer not available
 */
router.post('/admin', validateSchemaMiddleware(adminCreateTrainerBookingSchema), adminCreateTrainerBookingController);

/**
 * @swagger
 * /api/v1/trainer-bookings/stats:
 *   get:
 *     summary: Get trainer booking statistics
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trainer booking statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', getTrainerBookingStatsController);

/**
 * @swagger
 * /api/v1/trainer-bookings/expired:
 *   patch:
 *     summary: Update expired bookings (Admin only)
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expired bookings updated successfully
 *       401:
 *         description: Unauthorized
 */
router.patch('/expired', updateExpiredBookingsController);

/**
 * @swagger
 * /api/v1/trainer-bookings/{id}:
 *   get:
 *     summary: Get trainer booking by ID
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Trainer booking retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer booking not found
 *   put:
 *     summary: Update trainer booking
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTrainerBooking'
 *     responses:
 *       200:
 *         description: Trainer booking updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer booking not found
 *       409:
 *         description: Conflict - Time conflicts with existing bookings
 *   patch:
 *     summary: Cancel trainer booking
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Trainer booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer booking not found
 */
router.get('/:id', getTrainerBookingByIdController);
router.put('/:id', validateSchemaMiddleware(updateTrainerBookingSchema), updateTrainerBookingController);
router.patch('/:id/cancel', cancelTrainerBookingController);

/**
 * @swagger
 * /api/v1/trainer-bookings/trainer/{id}/calendar:
 *   get:
 *     summary: Get trainer availability calendar
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Trainer availability calendar retrieved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer not found
 */
router.get('/trainer/:id/calendar', getTrainerAvailabilityCalendarController);

/**
 * @swagger
 * /api/v1/trainer-bookings/trainer/{id}/status:
 *   patch:
 *     summary: Update trainer status manually
 *     tags: [Trainer Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTrainerStatus'
 *     responses:
 *       200:
 *         description: Trainer status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer not found
 *       409:
 *         description: Conflict - Cannot set to AVAILABLE while having active bookings
 */
router.patch('/trainer/:id/status', validateSchemaMiddleware(updateTrainerStatusSchema), updateTrainerStatusController);

export default router;
