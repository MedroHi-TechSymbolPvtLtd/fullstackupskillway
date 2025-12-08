import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats,
  updateLeadStatus,
  assignLead,
} from '../services/leadService';
import { 
  CreateLeadInput, 
  UpdateLeadInput, 
  UpdateLeadStatusInput, 
  AssignLeadInput,
  LeadQueryInput 
} from '../validators/lead';

/**
 * Lead controller
 * Handles lead capture and management operations
 */

// Create lead controller (public form)
export const createLeadController = asyncHandler(async (req: Request, res: Response) => {
  const leadData: CreateLeadInput = req.body;

  const lead = await createLead(leadData);

  sendSuccess(res, lead, 'Lead submitted successfully', 201);
});

// Get all leads controller (admin/sales only)
export const getAllLeadsController = asyncHandler(async (req: Request, res: Response) => {
  const queryParams: LeadQueryInput = req.query as any;

  const result = await getAllLeads(queryParams);

  sendPaginated(res, result.leads, result.pagination, 'Leads retrieved successfully');
});

// Get lead by ID controller (admin only)
export const getLeadByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const lead = await getLeadById(id);

  sendSuccess(res, lead, 'Lead retrieved successfully');
});

// Update lead controller (admin only)
export const updateLeadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const leadData: UpdateLeadInput = req.body;

  const lead = await updateLead(id, leadData);

  sendSuccess(res, lead, 'Lead updated successfully');
});

// Delete lead controller (admin only)
export const deleteLeadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await deleteLead(id);

  sendSuccess(res, result, 'Lead deleted successfully');
});

// Update lead status controller (admin/sales only)
export const updateLeadStatusController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const statusData: UpdateLeadStatusInput = req.body;
  const performedBy = req.user!.id;

  const lead = await updateLeadStatus(id, statusData, performedBy);

  // Check for conversion warnings
  const conversionWarning = (lead as any).conversionWarning;
  const message = conversionWarning 
    ? `Lead status updated successfully. Warning: ${conversionWarning}`
    : 'Lead status updated successfully';

  const response: any = {
    success: true,
    message,
    data: lead,
    timestamp: new Date().toISOString(),
  };

  if (conversionWarning) {
    response.warning = conversionWarning;
  }

  res.status(200).json(response);
});

// Assign lead controller (admin/sales only)
export const assignLeadController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const assignmentData: AssignLeadInput = req.body;
  const assignedBy = req.user!.id;

  const lead = await assignLead(id, assignmentData, assignedBy);

  sendSuccess(res, lead, 'Lead assigned successfully');
});

// Get lead statistics controller (admin/sales only)
export const getLeadStatsController = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getLeadStats();

  sendSuccess(res, stats, 'Lead statistics retrieved successfully');
});
