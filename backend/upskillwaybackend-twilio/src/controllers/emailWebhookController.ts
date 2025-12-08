import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { sendSuccess, sendError } from '../utils/response';

const prisma = new PrismaClient();

/**
 * Email Webhook Controller
 * Handles Brevo webhook events for delivery updates
 */

/**
 * Handle Brevo webhook events
 * POST /api/v1/email/webhook
 */
export const handleEmailWebhookController = async (req: Request, res: Response): Promise<void> => {
  try {
    const webhookData = req.body;

    logger.info('Email webhook received:', {
      event: webhookData.event,
      messageId: webhookData['message-id'],
      email: webhookData.email,
    });

    // Validate webhook data
    if (!webhookData.event || !webhookData['message-id']) {
      sendError(res, 'Invalid webhook data', 400);
      return;
    }

    // Process different webhook events
    switch (webhookData.event) {
      case 'delivered':
        await handleDeliveredEvent(webhookData);
        break;
      case 'opened':
        await handleOpenedEvent(webhookData);
        break;
      case 'clicked':
        await handleClickedEvent(webhookData);
        break;
      case 'bounced':
        await handleBouncedEvent(webhookData);
        break;
      case 'blocked':
        await handleBlockedEvent(webhookData);
        break;
      case 'unsubscribed':
        await handleUnsubscribedEvent(webhookData);
        break;
      case 'spam':
        await handleSpamEvent(webhookData);
        break;
      default:
        logger.warn('Unknown webhook event:', webhookData.event);
    }

    sendSuccess(res, { event: webhookData.event }, 'Webhook processed successfully', 200);
  } catch (error) {
    logger.error('Email webhook error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      body: req.body,
    });

    sendError(
      res,
      'Failed to process webhook',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};

/**
 * Handle delivered event
 */
async function handleDeliveredEvent(webhookData: any): Promise<void> {
  try {
    const messageId = webhookData['message-id'];
    const email = webhookData.email;
    const timestamp = webhookData.timestamp;

    // Update email log status
    await prisma.emailLog.updateMany({
      where: {
        messageId: messageId,
        to: email,
      },
      data: {
        status: 'DELIVERED',
        updatedAt: new Date(),
      },
    });

    logger.info('Email delivered event processed:', {
      messageId,
      email,
      timestamp,
    });
  } catch (error) {
    logger.error('Failed to process delivered event:', error);
  }
}

/**
 * Handle opened event
 */
async function handleOpenedEvent(webhookData: any): Promise<void> {
  try {
    const messageId = webhookData['message-id'];
    const email = webhookData.email;
    const timestamp = webhookData.timestamp;
    const ip = webhookData.ip;
    const userAgent = webhookData.useragent;

    // Update email log status
    await prisma.emailLog.updateMany({
      where: {
        messageId: messageId,
        to: email,
      },
      data: {
        status: 'OPENED',
        updatedAt: new Date(),
      },
    });

    logger.info('Email opened event processed:', {
      messageId,
      email,
      timestamp,
      ip,
      userAgent,
    });
  } catch (error) {
    logger.error('Failed to process opened event:', error);
  }
}

/**
 * Handle clicked event
 */
async function handleClickedEvent(webhookData: any): Promise<void> {
  try {
    const messageId = webhookData['message-id'];
    const email = webhookData.email;
    const timestamp = webhookData.timestamp;
    const url = webhookData.url;
    const ip = webhookData.ip;

    // Update email log status
    await prisma.emailLog.updateMany({
      where: {
        messageId: messageId,
        to: email,
      },
      data: {
        status: 'CLICKED',
        updatedAt: new Date(),
      },
    });

    logger.info('Email clicked event processed:', {
      messageId,
      email,
      timestamp,
      url,
      ip,
    });
  } catch (error) {
    logger.error('Failed to process clicked event:', error);
  }
}

/**
 * Handle bounced event
 */
async function handleBouncedEvent(webhookData: any): Promise<void> {
  try {
    const messageId = webhookData['message-id'];
    const email = webhookData.email;
    const timestamp = webhookData.timestamp;
    const reason = webhookData.reason;
    const type = webhookData.type; // hard_bounce, soft_bounce

    // Update email log status
    await prisma.emailLog.updateMany({
      where: {
        messageId: messageId,
        to: email,
      },
      data: {
        status: 'BOUNCED',
        error: reason,
        updatedAt: new Date(),
      },
    });

    logger.info('Email bounced event processed:', {
      messageId,
      email,
      timestamp,
      reason,
      type,
    });
  } catch (error) {
    logger.error('Failed to process bounced event:', error);
  }
}

/**
 * Handle blocked event
 */
async function handleBlockedEvent(webhookData: any): Promise<void> {
  try {
    const messageId = webhookData['message-id'];
    const email = webhookData.email;
    const timestamp = webhookData.timestamp;
    const reason = webhookData.reason;

    // Update email log status
    await prisma.emailLog.updateMany({
      where: {
        messageId: messageId,
        to: email,
      },
      data: {
        status: 'FAILED',
        error: `Blocked: ${reason}`,
        updatedAt: new Date(),
      },
    });

    logger.info('Email blocked event processed:', {
      messageId,
      email,
      timestamp,
      reason,
    });
  } catch (error) {
    logger.error('Failed to process blocked event:', error);
  }
}

/**
 * Handle unsubscribed event
 */
async function handleUnsubscribedEvent(webhookData: any): Promise<void> {
  try {
    const messageId = webhookData['message-id'];
    const email = webhookData.email;
    const timestamp = webhookData.timestamp;

    // Update email log status
    await prisma.emailLog.updateMany({
      where: {
        messageId: messageId,
        to: email,
      },
      data: {
        status: 'FAILED',
        error: 'Unsubscribed',
        updatedAt: new Date(),
      },
    });

    logger.info('Email unsubscribed event processed:', {
      messageId,
      email,
      timestamp,
    });
  } catch (error) {
    logger.error('Failed to process unsubscribed event:', error);
  }
}

/**
 * Handle spam event
 */
async function handleSpamEvent(webhookData: any): Promise<void> {
  try {
    const messageId = webhookData['message-id'];
    const email = webhookData.email;
    const timestamp = webhookData.timestamp;

    // Update email log status
    await prisma.emailLog.updateMany({
      where: {
        messageId: messageId,
        to: email,
      },
      data: {
        status: 'FAILED',
        error: 'Marked as spam',
        updatedAt: new Date(),
      },
    });

    logger.info('Email spam event processed:', {
      messageId,
      email,
      timestamp,
    });
  } catch (error) {
    logger.error('Failed to process spam event:', error);
  }
}

/**
 * Get webhook statistics
 * GET /api/v1/email/webhook/stats
 */
export const getWebhookStatsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.userId || (req.user as any)?.id;
    const userRole = req.user?.role as 'admin' | 'sales';

    if (!userId || !userRole) {
      sendError(res, 'User information not found', 401);
      return;
    }

    // Only admin users can view webhook stats
    if (userRole !== 'admin') {
      sendError(res, 'Only admin users can view webhook statistics', 403);
      return;
    }

    logger.info('Webhook stats request:', {
      userId,
      userRole,
    });

    // Get webhook statistics
    const stats = await prisma.emailLog.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    const result = {
      success: true,
      stats: stats.reduce((acc, stat) => {
        acc[stat.status.toLowerCase()] = stat._count.status;
        return acc;
      }, {} as Record<string, number>),
      timestamp: new Date().toISOString(),
    };

    sendSuccess(res, result, 'Webhook statistics retrieved successfully', 200);
  } catch (error) {
    logger.error('Webhook stats error:', {
      userId: (req.user as any)?.userId || (req.user as any)?.id,
      userRole: req.user?.role,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    sendError(
      res,
      'Failed to get webhook statistics',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
};
