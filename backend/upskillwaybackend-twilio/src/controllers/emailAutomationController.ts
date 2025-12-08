import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  createEmailAutomation,
  getAllEmailAutomations,
  getEmailAutomationById,
  updateEmailAutomation,
  deleteEmailAutomation,
  getAutomationLogs,
} from '../services/emailAutomationService';
import {
  CreateEmailAutomationInput,
  UpdateEmailAutomationInput,
  EmailAutomationQueryInput,
} from '../validators/emailAutomation';

/**
 * Email Automation Controller
 */

export const createEmailAutomationController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const automationData: CreateEmailAutomationInput = req.body;
  const userId = (req.user as any)?.id || (req.user as any)?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'User information not found',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const automation = await createEmailAutomation(automationData, userId);
  sendSuccess(res, automation, 'Email automation created successfully', 201);
});

export const getAllEmailAutomationsController = asyncHandler(async (req: Request, res: Response) => {
  const queryParams: EmailAutomationQueryInput = req.query as any;
  const result = await getAllEmailAutomations(queryParams);
  sendPaginated(res, result.automations, result.pagination, 'Email automations retrieved successfully');
});

export const getEmailAutomationByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const automation = await getEmailAutomationById(id);
  sendSuccess(res, automation, 'Email automation retrieved successfully');
});

export const updateEmailAutomationController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const automationData: UpdateEmailAutomationInput = req.body;
  const automation = await updateEmailAutomation(id, automationData);
  sendSuccess(res, automation, 'Email automation updated successfully');
});

export const deleteEmailAutomationController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteEmailAutomation(id);
  sendSuccess(res, result, 'Email automation deleted successfully');
});

export const getAutomationLogsController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await getAutomationLogs(id, { page, limit });
  sendPaginated(res, result.logs, result.pagination, 'Automation logs retrieved successfully');
});





