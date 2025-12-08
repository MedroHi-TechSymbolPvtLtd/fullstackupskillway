import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendEmailToLead, sendEmailToAllLeads } from '../services/leadEmailService';
import { SendEmailToLeadInput, SendEmailToAllLeadsInput } from '../validators/leadEmail';

/**
 * Lead Email Controller
 */

export const sendEmailToLeadController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const emailData: SendEmailToLeadInput = req.body;
  const userId = (req.user as any)?.id || (req.user as any)?.userId;
  const userRole = (req.user as any)?.role as 'admin' | 'sales';

  if (!userId || !userRole) {
    res.status(401).json({
      success: false,
      message: 'User information not found',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const result = await sendEmailToLead(emailData, userId, userRole);
  sendSuccess(res, result, 'Email sent to lead successfully');
});

export const sendEmailToAllLeadsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const emailData: SendEmailToAllLeadsInput = req.body;
  const userId = (req.user as any)?.id || (req.user as any)?.userId;
  const userRole = (req.user as any)?.role as 'admin' | 'sales';

  if (!userId || !userRole) {
    res.status(401).json({
      success: false,
      message: 'User information not found',
      error: 'UNAUTHORIZED',
    });
    return;
  }

  const result = await sendEmailToAllLeads(emailData, userId, userRole);
  sendSuccess(res, result, 'Bulk email sent to leads successfully');
});





