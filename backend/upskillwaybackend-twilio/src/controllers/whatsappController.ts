import { Request, Response } from 'express';
import { whatsappService, WhatsAppSendRequest, MessageHistoryFilters } from '../services/whatsappService';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { validateSchema } from '../utils/validation';
import { z } from 'zod';
import { WhatsAppMessageStatus } from '@prisma/client';

/**
 * WhatsApp Controller
 * Handles WhatsApp messaging API endpoints with proper validation and RBAC
 */

// Validation schemas
const sendMessageSchema = z.object({
  phoneNumber: z.string()
    .min(7, 'Phone number must be at least 7 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Phone number contains invalid characters'),
  message: z.string()
    .min(1, 'Message is required')
    .max(4096, 'Message must not exceed 4096 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  languageCode: z.string().length(2).optional(),
  country: z.string().length(2).optional(),
  media: z.object({
    type: z.enum(['image', 'video', 'audio', 'document']),
    url: z.string().url(),
    caption: z.string().optional(),
  }).optional(),
});

const bulkSendMessageSchema = z.object({
  messages: z.array(sendMessageSchema)
    .min(1, 'At least one message is required')
    .max(100, 'Maximum 100 messages allowed per bulk send'),
});

const messageHistoryFiltersSchema = z.object({
  phoneNumber: z.string().optional(),
  status: z.enum(['sent', 'delivered', 'read', 'failed']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

/**
 * Send single WhatsApp message
 * POST /api/v1/whatsapp/send
 */
export const sendMessageController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = validateSchema(sendMessageSchema, req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.errors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const messageData: WhatsAppSendRequest = validationResult.data;
    const userId = req.user?.id;
    const userRole = req.user?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('WhatsApp send message request:', {
      userId,
      userRole,
      phoneNumber: messageData.phoneNumber,
      messageLength: messageData.message.length,
    });

    // Send message via service
    const result = await whatsappService.sendMessage(messageData, userId, userRole);

    sendSuccess(res, result, 'WhatsApp message sent successfully', 200);
  } catch (error) {
    logger.error('WhatsApp send message error:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to send WhatsApp message',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Send bulk WhatsApp messages
 * POST /api/v1/whatsapp/send-bulk
 */
export const sendBulkMessagesController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validationResult = validateSchema(bulkSendMessageSchema, req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationResult.errors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { messages } = validationResult.data;
    const userId = req.user?.id;
    const userRole = req.user?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('WhatsApp bulk send messages request:', {
      userId,
      userRole,
      messageCount: messages.length,
    });

    // Send bulk messages via service
    const result = await whatsappService.sendBulkMessages(messages, userId, userRole);

    sendSuccess(res, result, 'Bulk WhatsApp messages processed', 200);
  } catch (error) {
    logger.error('WhatsApp bulk send messages error:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to send bulk WhatsApp messages',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Get WhatsApp message history
 * GET /api/v1/whatsapp/history
 */
export const getMessageHistoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate query parameters
    const validationResult = validateSchema(messageHistoryFiltersSchema, req.query);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors: validationResult.errors,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Convert string status to enum if provided
    const filters: MessageHistoryFilters = {
      ...validationResult.data,
      status: validationResult.data.status
        ? (validationResult.data.status.toUpperCase() as WhatsAppMessageStatus)
        : undefined,
    };
    const userId = req.user?.id;
    const userRole = req.user?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('WhatsApp message history request:', {
      userId,
      userRole,
      filters,
    });

    // Get message history via service
    const result = await whatsappService.getMessageHistory(userId, userRole, filters);

    sendSuccess(res, result, 'WhatsApp message history retrieved successfully', 200);
  } catch (error) {
    logger.error('WhatsApp message history error:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to get WhatsApp message history',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Get WhatsApp message statistics
 * GET /api/v1/whatsapp/statistics
 */
export const getMessageStatisticsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('WhatsApp message statistics request:', {
      userId,
      userRole,
    });

    // Get message statistics via service
    const result = await whatsappService.getMessageStatistics(userId, userRole);

    sendSuccess(res, result, 'WhatsApp message statistics retrieved successfully', 200);
  } catch (error) {
    logger.error('WhatsApp message statistics error:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to get WhatsApp message statistics',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Get WhatsApp API status
 * GET /api/v1/whatsapp/status
 */
export const getWhatsAppStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    logger.info('WhatsApp status request:', {
      userId,
      userRole,
    });

    // For now, return basic status information
    // In the future, you can add actual Twilio API health check
    const status = {
      apiStatus: 'active',
      provider: 'twilio',
      accountSid: process.env.TWILIO_ACCOUNT_SID ? '***' + process.env.TWILIO_ACCOUNT_SID.slice(-4) : undefined,
      fromNumber: process.env.TWILIO_WHATSAPP_FROM,
      lastChecked: new Date().toISOString(),
    };

    sendSuccess(res, status, 'WhatsApp API status retrieved successfully', 200);
  } catch (error) {
    logger.error('WhatsApp status error:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to get WhatsApp API status',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Test WhatsApp message (for development/testing)
 * POST /api/v1/whatsapp/test
 */
export const testWhatsAppController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    // Only allow admin users to test
    if (userRole !== 'admin') {
      sendError(res, 'Only admin users can test WhatsApp functionality', 403);
      return;
    }

    logger.info('WhatsApp test request:', {
      userId,
      userRole,
    });

    // Create a test message
    const testMessage: WhatsAppSendRequest = {
      phoneNumber: '919876543210', // Test phone number
      message: 'This is a test message from UpSkillWay WhatsApp API',
      firstName: 'Test',
      lastName: 'User',
      languageCode: 'en',
      country: 'IN',
    };

    // Send test message via service
    const result = await whatsappService.sendMessage(testMessage, userId, userRole);

    sendSuccess(res, result, 'WhatsApp test message sent successfully', 200);
  } catch (error) {
    logger.error('WhatsApp test error:', {
      userId: req.user?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to send WhatsApp test message',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
