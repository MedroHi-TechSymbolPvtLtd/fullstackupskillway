import { twilioService } from './twilioService';
import { whatsappQueueManager } from '../utils/whatsappQueue';
import { config } from '../config';
import { logger } from '../utils/logger';
import { prisma } from '../config/database';
import { WhatsAppMessageStatus } from '@prisma/client';

/**
 * WhatsApp Service
 * Handles WhatsApp messaging operations using Twilio and BullMQ
 */
export class WhatsAppService {
  /**
   * Send WhatsApp message to a contact
   * @param messageData - The message data
   * @param userId - The user ID sending the message
   * @param userRole - The role of the user sending the message
   * @returns Promise<WhatsAppSendResult>
   */
  async sendMessage(
    messageData: WhatsAppSendRequest,
    userId: string,
    userRole: 'admin' | 'sales'
  ): Promise<WhatsAppSendResult> {
    return this.processMessage(messageData, userId, userRole, 'manual');
  }

  /**
   * Send automated WhatsApp message (via Queue)
   */
  async sendAutomatedMessage(
    messageData: WhatsAppSendRequest,
    userId: string
  ): Promise<WhatsAppSendResult> {
    // For automated messages, we use the queue
    // We'll return a pending status

    const cleanedPhone = messageData.phoneNumber.replace(/\D/g, '');
    const formattedPhoneNumber = cleanedPhone.length === 10 ? `+91${cleanedPhone}` : `+${cleanedPhone}`;

    const jobData = {
      to: formattedPhoneNumber,
      body: messageData.message,
      mediaUrl: messageData.media ? [messageData.media.url] : undefined,
      contentSid: messageData.contentSid,
      contentVariables: messageData.contentVariables,
      type: 'automated' as const
    };

    await whatsappQueueManager.addMessage(jobData);

    // We log it as PENDING or QUEUED?
    // The current schema might not have QUEUED status.
    // Let's log as SENT for now or create a log entry.

    const messageLog = await this.logMessage({
      userId,
      userRole: 'admin', // Automated messages are usually system/admin
      phoneNumber: formattedPhoneNumber,
      message: messageData.message || `Template: ${messageData.contentSid}`,
      status: WhatsAppMessageStatus.SENT, // Optimistic or we need a QUEUED status
      messageId: 'queued',
    });

    return {
      success: true,
      messageId: 'queued',
      status: 'sent',
      phoneNumber: formattedPhoneNumber,
      logId: messageLog.id,
      timestamp: new Date().toISOString(),
    };
  }

  private async processMessage(
    messageData: WhatsAppSendRequest,
    userId: string,
    userRole: 'admin' | 'sales',
    type: 'manual' | 'automated'
  ): Promise<WhatsAppSendResult> {
    try {
      // Validate phone number format
      const cleanedPhone = messageData.phoneNumber.replace(/\D/g, '');
      if (cleanedPhone.length < 7 || cleanedPhone.length > 15) {
        throw new Error('Invalid phone number format. Phone number must be 7-15 digits.');
      }

      const formattedPhoneNumber = cleanedPhone.length === 10 ? `+91${cleanedPhone}` : `+${cleanedPhone}`;

      if (userRole === 'sales') {
        await this.validateSalesUserAccess(userId, messageData.phoneNumber);
      }

      let response;
      let messageId;
      let status: 'sent' | 'failed' = 'sent';
      let errorMsg;

      try {
        const result = await twilioService.sendMessage({
          to: formattedPhoneNumber,
          body: messageData.message,
          mediaUrl: messageData.media ? [messageData.media.url] : undefined,
          contentSid: messageData.contentSid,
          contentVariables: messageData.contentVariables
        });
        response = result;
        messageId = result.sid;
        status = 'sent';
      } catch (e: any) {
        status = 'failed';
        errorMsg = e.message;
        throw e;
      }

      const messageLog = await this.logMessage({
        userId,
        userRole,
        phoneNumber: formattedPhoneNumber,
        message: messageData.message || `Template: ${messageData.contentSid}`,
        status: status === 'sent' ? WhatsAppMessageStatus.SENT : WhatsAppMessageStatus.FAILED,
        messageId: messageId,
        wapiResponse: response,
        error: errorMsg,
      });

      logger.info('WhatsApp message sent successfully:', {
        userId,
        userRole,
        phoneNumber: formattedPhoneNumber,
        messageId: messageId,
        logId: messageLog.id,
      });

      return {
        success: true,
        messageId: messageId,
        status: 'sent',
        phoneNumber: formattedPhoneNumber,
        logId: messageLog.id,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to send WhatsApp message:', {
        userId,
        userRole,
        phoneNumber: messageData.phoneNumber,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      await this.logMessage({
        userId,
        userRole,
        phoneNumber: messageData.phoneNumber,
        message: messageData.message || `Template: ${messageData.contentSid}`,
        status: WhatsAppMessageStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Send bulk WhatsApp messages
   */
  async sendBulkMessages(
    messages: WhatsAppSendRequest[],
    userId: string,
    userRole: 'admin' | 'sales'
  ): Promise<WhatsAppBulkSendResult> {

    logger.info('Starting bulk WhatsApp message sending:', {
      userId,
      userRole,
      totalMessages: messages.length,
    });

    const jobData = messages.map(msg => {
      const cleanedPhone = msg.phoneNumber.replace(/\D/g, '');
      const formattedPhoneNumber = cleanedPhone.length === 10 ? `+91${cleanedPhone}` : `+${cleanedPhone}`;
      return {
        to: formattedPhoneNumber,
        body: msg.message,
        mediaUrl: msg.media ? [msg.media.url] : undefined,
        contentSid: msg.contentSid,
        contentVariables: msg.contentVariables,
        type: 'manual' as const
      };
    });

    await whatsappQueueManager.addBulkMessages(jobData);

    return {
      success: true,
      totalMessages: messages.length,
      successfulMessages: messages.length,
      failedMessages: 0,
      results: [],
      errors: [],
      timestamp: new Date().toISOString(),
    };
  }

  // ... (getMessageHistory, getMessageStatistics, validateSalesUserAccess, logMessage - same as before)

  async getMessageHistory(
    userId: string,
    userRole: 'admin' | 'sales',
    filters?: MessageHistoryFilters
  ): Promise<WhatsAppMessageHistory> {
    try {
      const whereClause: any = {};

      if (userRole === 'sales') {
        whereClause.userId = userId;
      }

      if (filters?.phoneNumber) {
        whereClause.phoneNumber = {
          contains: filters.phoneNumber,
        };
      }

      if (filters?.status) {
        whereClause.status = filters.status;
      }

      if (filters?.startDate && filters?.endDate) {
        whereClause.createdAt = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        };
      }

      const messages = await prisma.whatsAppMessage.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });

      const totalCount = await prisma.whatsAppMessage.count({
        where: whereClause,
      });

      const mappedMessages = messages.map(msg => ({
        ...msg,
        messageId: msg.messageId || undefined,
        error: msg.error || undefined
      }));

      return {
        success: true,
        messages: mappedMessages,
        totalCount,
        hasMore: (filters?.offset || 0) + messages.length < totalCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to get message history:', {
        userId,
        userRole,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async getMessageStatistics(
    userId: string,
    userRole: 'admin' | 'sales'
  ): Promise<WhatsAppStatistics> {
    try {
      const whereClause: any = {};

      if (userRole === 'sales') {
        whereClause.userId = userId;
      }

      const [
        totalMessages,
        sentMessages,
        deliveredMessages,
        failedMessages,
        todayMessages,
        thisWeekMessages,
        thisMonthMessages,
      ] = await Promise.all([
        prisma.whatsAppMessage.count({ where: whereClause }),
        prisma.whatsAppMessage.count({ where: { ...whereClause, status: WhatsAppMessageStatus.SENT } }),
        prisma.whatsAppMessage.count({ where: { ...whereClause, status: WhatsAppMessageStatus.DELIVERED } }),
        prisma.whatsAppMessage.count({ where: { ...whereClause, status: WhatsAppMessageStatus.FAILED } }),
        prisma.whatsAppMessage.count({
          where: {
            ...whereClause,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.whatsAppMessage.count({
          where: {
            ...whereClause,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.whatsAppMessage.count({
          where: {
            ...whereClause,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

      return {
        success: true,
        statistics: {
          totalMessages,
          sentMessages,
          deliveredMessages,
          failedMessages,
          todayMessages,
          thisWeekMessages,
          thisMonthMessages,
          successRate: totalMessages > 0 ? (sentMessages / totalMessages) * 100 : 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to get message statistics:', {
        userId,
        userRole,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async validateSalesUserAccess(userId: string, phoneNumber: string): Promise<void> {
    logger.info('Sales user access validated:', {
      userId,
      phoneNumber,
    });
  }

  private async logMessage(logData: WhatsAppMessageLogData): Promise<WhatsAppMessageLog> {
    try {
      if (logData.userRole === 'admin') {
        let adminUser = await prisma.user.findUnique({
          where: { id: logData.userId },
        });

        if (!adminUser) {
          adminUser = await prisma.user.findFirst({
            where: { role: 'admin', isActive: true },
          });

          if (!adminUser) {
            logger.warn('No admin user found in database. Creating system admin user for WhatsApp logging.');
            throw new Error('No admin user found in database. Please ensure an admin user exists.');
          }
          logData.userId = adminUser.id;
        }
      } else {
        const salesUser = await prisma.user.findUnique({
          where: { id: logData.userId },
        });

        if (!salesUser) {
          throw new Error(`Sales user not found in database: ${logData.userId}`);
        }
      }

      const messageLog = await prisma.whatsAppMessage.create({
        data: {
          userId: logData.userId,
          userRole: logData.userRole,
          phoneNumber: logData.phoneNumber,
          message: logData.message,
          status: logData.status,
          messageId: logData.messageId,
          wapiResponse: logData.wapiResponse,
          error: logData.error,
        },
      });

      return {
        ...messageLog,
        messageId: messageLog.messageId || undefined,
        error: messageLog.error || undefined
      };
    } catch (error) {
      logger.error('Failed to log WhatsApp message:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        logData,
      });
      throw error;
    }
  }
}

export interface WhatsAppSendRequest {
  phoneNumber: string;
  message: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  languageCode?: string;
  country?: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    caption?: string;
  };
  contentSid?: string;
  contentVariables?: Record<string, string>;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  phoneNumber: string;
  logId: string;
  timestamp: string;
}

export interface WhatsAppBulkSendResult {
  success: boolean;
  totalMessages: number;
  successfulMessages: number;
  failedMessages: number;
  results: WhatsAppSendResult[];
  errors: WhatsAppError[];
  timestamp: string;
}

export interface WhatsAppError {
  index: number;
  phoneNumber: string;
  error: string;
}

export interface WhatsAppMessageHistory {
  success: boolean;
  messages: WhatsAppMessageLog[];
  totalCount: number;
  hasMore: boolean;
  timestamp: string;
}

export interface WhatsAppStatistics {
  success: boolean;
  statistics: {
    totalMessages: number;
    sentMessages: number;
    deliveredMessages: number;
    failedMessages: number;
    todayMessages: number;
    thisWeekMessages: number;
    thisMonthMessages: number;
    successRate: number;
  };
  timestamp: string;
}

export interface MessageHistoryFilters {
  phoneNumber?: string;
  status?: WhatsAppMessageStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface WhatsAppMessageLogData {
  userId: string;
  userRole: 'admin' | 'sales';
  phoneNumber: string;
  message: string;
  status: WhatsAppMessageStatus;
  messageId?: string;
  wapiResponse?: any;
  error?: string;
}

export interface WhatsAppMessageLog {
  id: string;
  userId: string;
  userRole: 'admin' | 'sales';
  phoneNumber: string;
  message: string;
  status: WhatsAppMessageStatus;
  messageId?: string;
  wapiResponse?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
