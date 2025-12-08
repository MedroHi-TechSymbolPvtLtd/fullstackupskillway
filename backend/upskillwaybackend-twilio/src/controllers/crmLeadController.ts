import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import { LeadStage } from '@prisma/client';
import {
  updateLeadStage,
  assignLeadToSales,
  convertLeadToCollege,
  getLeadActivities,
  addLeadActivity,
  getLeadsByStage,
  getLeadFunnelStats,
  getLeadPerformanceStats,
  recycleLeadToProspect,
  bulkAssignLeads,
  getMyAssignedLeads,
} from '../services/crmLeadService';
import { 
  updateCrmLeadSchema,
  crmLeadQuerySchema,
  UpdateCrmLeadInput 
} from '../validators/crm';

/**
 * @swagger
 * components:
 *   schemas:
 *     LeadStageUpdate:
 *       type: object
 *       properties:
 *         stage:
 *           type: string
 *           enum: [LEAD_GENERATED, CONTACTED, DEMO_GIVEN, TRAINING_BOOKED, IN_PROGRESS, CLOSED_WON, FEEDBACK_COLLECTED, DENIED]
 *         notes:
 *           type: string
 *         nextFollowUp:
 *           type: string
 *           format: date-time
 *     LeadAssignment:
 *       type: object
 *       properties:
 *         assignedToId:
 *           type: string
 *           format: uuid
 *         notes:
 *           type: string
 *     LeadConversion:
 *       type: object
 *       properties:
 *         collegeName:
 *           type: string
 *         location:
 *           type: string
 *         type:
 *           type: string
 *         contactPerson:
 *           type: string
 *         contactEmail:
 *           type: string
 *         contactPhone:
 *           type: string
 *     LeadActivity:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [CALL, EMAIL, MEETING, DEMO, FOLLOW_UP, STAGE_CHANGE, ASSIGNMENT, NOTE, TRAINING_SCHEDULED, TRAINING_COMPLETED]
 *         description:
 *           type: string
 *         notes:
 *           type: string
 */

// Update lead stage
export const updateLeadStageController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, notes, nextFollowUp } = req.body;
  const userId = req.user!.id;

  const lead = await updateLeadStage(id, stage, {
    notes,
    nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : undefined,
    performedBy: userId,
  });

  sendSuccess(res, lead, 'Lead stage updated successfully');
});

// Assign lead to sales person
export const assignLeadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { assignedToId, notes } = req.body;
  const assignedBy = req.user!.id;

  const lead = await assignLeadToSales(id, assignedToId, {
    notes,
    assignedBy,
  });

  sendSuccess(res, lead, 'Lead assigned successfully');
});

// Convert lead to college
export const convertLeadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const collegeData = req.body;
  const convertedBy = req.user!.id;

  const result = await convertLeadToCollege(id, collegeData, convertedBy);

  sendSuccess(res, result, 'Lead converted to college successfully');
});

// Recycle denied lead back to prospect
export const recycleLeadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  const recycledBy = req.user!.id;

  const lead = await recycleLeadToProspect(id, {
    notes,
    recycledBy,
  });

  sendSuccess(res, lead, 'Lead recycled to prospect successfully');
});

// Get lead activities
export const getLeadActivitiesController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page, limit } = crmLeadQuerySchema.parse(req.query);

  const result = await getLeadActivities(id, page as number, limit as number);

  sendPaginated(res, result.activities, result.pagination, 'Lead activities retrieved successfully');
});

// Add lead activity
export const addLeadActivityController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, description, notes } = req.body;
  const performedBy = req.user!.id;

  const activity = await addLeadActivity(id, {
    type,
    description,
    notes,
    performedBy,
  });

  sendSuccess(res, activity, 'Lead activity added successfully', 201);
});

// Get leads by stage
export const getLeadsByStageController = asyncHandler(async (req: Request, res: Response) => {
  const { stage } = req.params;
  const { page, limit, assignedTo } = crmLeadQuerySchema.parse(req.query);

  const result = await getLeadsByStage(stage as LeadStage, page as number, limit as number, {
    assignedTo,
  });

  sendPaginated(res, result.leads, result.pagination, `${stage} leads retrieved successfully`);
});

// Get lead funnel statistics
export const getLeadFunnelStatsController = asyncHandler(async (req: Request, res: Response) => {
  const { dateFrom, dateTo, assignedTo } = req.query;

  const stats = await getLeadFunnelStats({
    dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
    dateTo: dateTo ? new Date(dateTo as string) : undefined,
    assignedTo: assignedTo as string,
  });

  sendSuccess(res, stats, 'Lead funnel statistics retrieved successfully');
});

// Get lead performance statistics
export const getLeadPerformanceStatsController = asyncHandler(async (req: Request, res: Response) => {
  const { period, assignedTo } = req.query;

  const stats = await getLeadPerformanceStats({
    period: period as string || 'month',
    assignedTo: assignedTo as string,
  });

  sendSuccess(res, stats, 'Lead performance statistics retrieved successfully');
});

// Bulk assign leads
export const bulkAssignLeadsController = asyncHandler(async (req: Request, res: Response) => {
  const { leadIds, assignedToId, notes } = req.body;
  const assignedBy = req.user!.id;

  const result = await bulkAssignLeads(leadIds, assignedToId, {
    notes,
    assignedBy,
  });

  sendSuccess(res, result, 'Leads assigned successfully');
});

// Get my assigned leads (for sales users)
export const getMyAssignedLeadsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { page, limit, stage, priority } = crmLeadQuerySchema.parse(req.query);

  const result = await getMyAssignedLeads(userId, page as number, limit as number, {
    stage,
    priority,
  });

  sendPaginated(res, result.leads, result.pagination, 'My assigned leads retrieved successfully');
});