import { Request, Response } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
  getTemplatesByCategory,
} from '../services/emailTemplateService';
import {
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
  EmailTemplateQueryInput,
} from '../validators/emailTemplate';

/**
 * Email Template Controller
 */

export const createEmailTemplateController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const templateData: CreateEmailTemplateInput = req.body;
  const userId = (req.user as any)?.id || (req.user as any)?.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
    return;
  }

  const template = await createEmailTemplate(templateData, userId);
  sendSuccess(res, template, 'Email template created successfully', 201);
});

export const getAllEmailTemplatesController = asyncHandler(async (req: Request, res: Response) => {
  const queryParams: EmailTemplateQueryInput = req.query as any;
  const result = await getAllEmailTemplates(queryParams);
  sendPaginated(res, result.templates, result.pagination, 'Email templates retrieved successfully');
});

export const getEmailTemplateByIdController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const template = await getEmailTemplateById(id);
  sendSuccess(res, template, 'Email template retrieved successfully');
});

export const updateEmailTemplateController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const templateData: UpdateEmailTemplateInput = req.body;
  const template = await updateEmailTemplate(id, templateData);
  sendSuccess(res, template, 'Email template updated successfully');
});

export const deleteEmailTemplateController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteEmailTemplate(id);
  sendSuccess(res, result, 'Email template deleted successfully');
});

export const getTemplatesByCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.params;
  const templates = await getTemplatesByCategory(category);
  sendSuccess(res, templates, 'Email templates retrieved successfully');
});





