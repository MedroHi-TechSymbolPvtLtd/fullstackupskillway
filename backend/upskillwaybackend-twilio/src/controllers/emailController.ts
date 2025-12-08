import { Request, Response } from 'express';
import { emailService, EmailSendRequest, EmailCampaignRequest, EmailHistoryFilters } from '../services/emailService';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { validateSchema } from '../utils/validation';
import { z } from 'zod';

/**
 * Email Controller
 * Handles email API endpoints with proper validation and RBAC
 */

// Validation schemas
const sendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  toName: z.string().optional(),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must not exceed 200 characters'),
  html: z.string().min(1, 'HTML content is required'),
  text: z.string().optional(),
  from: z.object({
    name: z.string(),
    email: z.string().email(),
  }).optional(),
  replyTo: z.object({
    name: z.string(),
    email: z.string().email(),
  }).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    content: z.string(),
  })).optional(),
  headers: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  transport: z.enum(['api', 'smtp']).optional(),
  queue: z.boolean().optional(),
  delay: z.number().int().min(0).optional(),
});

const bulkSendEmailSchema = z.object({
  emails: z.array(sendEmailSchema)
    .min(1, 'At least one email is required')
    .max(100, 'Maximum 100 emails allowed per bulk send'),
  transport: z.enum(['api', 'smtp']).optional(),
  queue: z.boolean().optional(),
  delay: z.number().int().min(0).optional(),
});

const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100, 'Campaign name must not exceed 100 characters'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must not exceed 200 characters'),
  sender: z.object({
    name: z.string().min(1, 'Sender name is required'),
    email: z.string().email('Invalid sender email'),
  }),
  htmlContent: z.string().min(1, 'HTML content is required'),
  textContent: z.string().optional(),
  listIds: z.array(z.number().int().positive()).optional(),
  scheduledAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  queue: z.boolean().optional(),
  delay: z.number().int().min(0).optional(),
});

const sendCampaignSchema = z.object({
  campaignId: z.number().int().positive('Invalid campaign ID'),
});

const emailHistoryFiltersSchema = z.object({
  to: z.string().optional(),
  status: z.enum(['sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'queued']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

/**
 * Send transactional email
 * POST /api/v1/email/send
 */
export const sendEmailController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = validateSchema(sendEmailSchema, req.body);
    if (!validationResult.success) {
      sendError(res, 'Validation failed', 400, validationResult.errors);
      return;
    }

    const emailData: EmailSendRequest = validationResult.data;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('Email send request:', {
      userId,
      userRole,
      to: emailData.to,
      subject: emailData.subject,
      transport: emailData.transport,
      queue: emailData.queue,
    });

    // Send email via service
    const result = await emailService.sendTransactionalEmail(
      emailData,
      userId,
      userRole,
      {
        transport: emailData.transport,
        queue: emailData.queue,
        delay: emailData.delay,
      }
    );

    sendSuccess(res, result, 'Email sent successfully', 200);
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = error?.statusCode || 500;

    logger.error('Email send error:', {
      userId: (req.user as any)?.id || (req.user as any)?.userId,
      userRole: (req.user as any)?.role,
      error: errorMessage,
      statusCode,
      details: error?.details,
    });

    // For 401 errors, provide more specific message
    if (statusCode === 401) {
      sendError(
        res,
        'Brevo API authentication failed. Please check your BREVO_API_KEY in .env file.',
        statusCode,
        errorMessage
      );
    } else {
      sendError(
        res,
        'Failed to send email',
        statusCode,
        errorMessage
      );
    }
  }
};

/**
 * Send bulk transactional emails
 * POST /api/v1/email/send-bulk
 */
export const sendBulkEmailsController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = validateSchema(bulkSendEmailSchema, req.body);
    if (!validationResult.success) {
      sendError(res, 'Validation failed', 400, validationResult.errors);
      return;
    }

    const { emails, transport, queue, delay } = validationResult.data;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('Bulk email send request:', {
      userId,
      userRole,
      emailCount: emails.length,
      transport,
      queue,
    });

    // Send bulk emails via service
    const result = await emailService.sendBulkTransactionalEmails(
      emails,
      userId,
      userRole,
      {
        transport,
        queue,
        delay,
      }
    );

    sendSuccess(res, result, 'Bulk emails processed', 200);
  } catch (error) {
    logger.error('Bulk email send error:', {
      userId: (req.user as any)?.id || (req.user as any)?.userId,
      userRole: (req.user as any)?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to send bulk emails',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Create email campaign
 * POST /api/v1/email/campaign/create
 */
export const createCampaignController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = validateSchema(createCampaignSchema, req.body);
    if (!validationResult.success) {
      sendError(res, 'Validation failed', 400, validationResult.errors);
      return;
    }

    const campaignData: EmailCampaignRequest = validationResult.data;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('Create campaign request:', {
      userId,
      userRole,
      campaignName: campaignData.name,
      subject: campaignData.subject,
      queue: campaignData.queue,
    });

    // Create campaign via service
    const result = await emailService.createEmailCampaign(
      campaignData,
      userId,
      userRole,
      {
        queue: campaignData.queue,
        delay: campaignData.delay,
      }
    );

    sendSuccess(res, result, 'Email campaign created successfully', 200);
  } catch (error) {
    logger.error('Create campaign error:', {
      userId: (req.user as any)?.id || (req.user as any)?.userId,
      userRole: (req.user as any)?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to create email campaign',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Send email campaign
 * POST /api/v1/email/campaign/send
 */
export const sendCampaignController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = validateSchema(sendCampaignSchema, req.body);
    if (!validationResult.success) {
      sendError(res, 'Validation failed', 400, validationResult.errors);
      return;
    }

    const { campaignId } = validationResult.data;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('Send campaign request:', {
      userId,
      userRole,
      campaignId,
    });

    // Send campaign via service
    const result = await emailService.sendEmailCampaign(campaignId, userId, userRole);

    sendSuccess(res, result, 'Email campaign sent successfully', 200);
  } catch (error) {
    logger.error('Send campaign error:', {
      userId: (req.user as any)?.id || (req.user as any)?.userId,
      userRole: (req.user as any)?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to send email campaign',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Get email history
 * GET /api/v1/email/history
 */
export const getEmailHistoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate query parameters
    const validationResult = validateSchema(emailHistoryFiltersSchema, req.query);
    if (!validationResult.success) {
      sendError(res, 'Validation failed', 400, validationResult.errors);
      return;
    }

    const filters: EmailHistoryFilters = validationResult.data;
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('Email history request:', {
      userId,
      userRole,
      filters,
    });

    // Get email history via service
    const result = await emailService.getEmailHistory(userId, userRole, filters);

    sendSuccess(res, result, 'Email history retrieved successfully', 200);
  } catch (error) {
    logger.error('Email history error:', {
      userId: (req.user as any)?.id || (req.user as any)?.userId,
      userRole: (req.user as any)?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to get email history',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Get email statistics
 * GET /api/v1/email/statistics
 */
export const getEmailStatisticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('Email statistics request:', {
      userId,
      userRole,
    });

    // Get email statistics via service
    const result = await emailService.getEmailStatistics(userId, userRole);

    sendSuccess(res, result, 'Email statistics retrieved successfully', 200);
  } catch (error) {
    logger.error('Email statistics error:', {
      userId: (req.user as any)?.id || (req.user as any)?.userId,
      userRole: (req.user as any)?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to get email statistics',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Get queue statistics
 * GET /api/v1/email/queue/stats
 */
export const getQueueStatsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('Queue stats request:', {
      userId,
      userRole,
    });

    // Get queue statistics via service
    const result = await emailService.getQueueStatistics();

    sendSuccess(res, result, 'Queue statistics retrieved successfully', 200);
  } catch (error) {
    logger.error('Queue stats error:', {
      userId: (req.user as any)?.id || (req.user as any)?.userId,
      userRole: (req.user as any)?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to get queue statistics',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Test email functionality (Admin only)
 * POST /api/v1/email/test
 */
export const testEmailController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id || (req.user as any)?.userId;
    const userRole = (req.user as any)?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    // Only allow admin users to test
    if (userRole !== 'admin') {
      sendError(res, 'Only admin users can test email functionality', 403);
      return;
    }

    logger.info('Email test request:', {
      userId,
      userRole,
    });

    // Create a test email
    const testEmail: EmailSendRequest = {
      to: 'test@example.com',
      subject: 'Test Email from UpSkillWay',
      html: '<h1>Test Email</h1><p>This is a test email from UpSkillWay Email API.</p>',
      text: 'Test Email\n\nThis is a test email from UpSkillWay Email API.',
    };

    // Send test email via service
    const result = await emailService.sendTransactionalEmail(testEmail, userId, userRole, {
      transport: 'api',
      queue: false,
    });

    sendSuccess(res, result, 'Test email sent successfully', 200);
  } catch (error) {
    logger.error('Email test error:', {
      userId: (req.user as any)?.userId || (req.user as any)?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to send test email',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
