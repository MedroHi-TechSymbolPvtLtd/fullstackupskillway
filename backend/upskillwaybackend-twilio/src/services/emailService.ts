import { brevoClient, BrevoTransactionalEmail, BrevoCampaignData, BrevoApiResponse, BrevoCampaignResponse } from '../utils/brevoClient';
import { emailQueueManager, TransactionalEmailJobData, CampaignEmailJobData } from '../utils/emailQueue';
import { config } from '../config';
import { logger } from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Email Service
 * Handles email operations using Brevo API with queue support
 */
export class EmailService {
  /**
   * Send transactional email
   * @param emailData - Email data
   * @param userId - User ID sending the email
   * @param userRole - Role of the user sending the email
   * @param options - Send options
   * @returns Promise<EmailSendResult>
   */
  async sendTransactionalEmail(
    emailData: EmailSendRequest,
    userId: string,
    userRole: 'admin' | 'sales',
    options: EmailSendOptions = {}
  ): Promise<EmailSendResult> {
    try {
      // Validate email address
      if (!brevoClient.validateEmail(emailData.to)) {
        throw new Error('Invalid email address format');
      }

      // Check if sales user can send email to this recipient
      if (userRole === 'sales') {
        await this.validateSalesUserAccess(userId, emailData.to);
      }

      // Prepare Brevo email data
      const brevoEmailData: BrevoTransactionalEmail = {
        to: emailData.to,
        toName: emailData.toName,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        from: emailData.from || {
          name: 'UpSkillWay',
          email: config.brevo.smtpUser || 'noreply@upskillway.com',
        },
        replyTo: emailData.replyTo,
        attachments: emailData.attachments,
        headers: emailData.headers,
        tags: emailData.tags,
      };

      let result: BrevoApiResponse;

      // Send email based on options
      if (options.queue) {
        // Add to queue for async processing
        const job = await emailQueueManager.addTransactionalEmail(
          brevoEmailData,
          options.transport || 'api',
          options.delay
        );

        // Log the email in database
        const emailLog = await this.logEmail({
          userId,
          userRole,
          to: emailData.to,
          subject: emailData.subject,
          status: 'queued',
          jobId: job.id,
          transport: options.transport || 'api',
        });

        logger.info('Transactional email queued successfully:', {
          userId,
          userRole,
          to: emailData.to,
          jobId: job.id,
          logId: emailLog.id,
        });

        return {
          success: true,
          messageId: job.id,
          status: 'queued',
          method: options.transport || 'api',
          logId: emailLog.id,
          timestamp: new Date().toISOString(),
        };
      } else {
        // Send immediately
        if (options.transport === 'smtp') {
          result = await brevoClient.sendSmtpEmail(brevoEmailData);
        } else {
          result = await brevoClient.sendTransactionalEmail(brevoEmailData);
        }

        // Log the email in database
        const emailLog = await this.logEmail({
          userId,
          userRole,
          to: emailData.to,
          subject: emailData.subject,
          status: result.status,
          messageId: result.messageId,
          transport: options.transport || 'api',
          brevoResponse: result,
        });

        logger.info('Transactional email sent successfully:', {
          userId,
          userRole,
          to: emailData.to,
          messageId: result.messageId,
          logId: emailLog.id,
        });

        // Create notification for successful email send
        try {
          const { notifyEmailSent } = await import('./notificationService');
          await notifyEmailSent(userId, emailData.to, emailData.subject, emailLog.id);
        } catch (notifError) {
          logger.error('Failed to create email sent notification', notifError);
          // Don't fail if notification creation fails
        }

        return {
          success: true,
          messageId: result.messageId,
          status: result.status as any,
          method: result.method,
          logId: emailLog.id,
          timestamp: result.timestamp,
        };
      }
    } catch (error: any) {
      // Extract detailed error message
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check if it's a Brevo API error with details
        if ((error as any).details) {
          errorMessage = `Brevo API Error: ${error.message}`;
          if ((error as any).details.body?.message) {
            errorMessage += ` - ${(error as any).details.body.message}`;
          }
        }
      }

      logger.error('Failed to send transactional email:', {
        userId,
        userRole,
        to: emailData.to,
        error: errorMessage,
        statusCode: error?.statusCode || error?.details?.status,
        details: error?.details,
      });

      // Log failed email attempt (wrap in try-catch to prevent logging errors from breaking the flow)
      let emailLogId: string | undefined;
      try {
        const emailLog = await this.logEmail({
          userId,
          userRole,
          to: emailData.to,
          subject: emailData.subject,
          status: 'failed',
          error: errorMessage,
          transport: options.transport || 'api',
        });
        emailLogId = emailLog.id;
      } catch (logError) {
        // Don't fail if logging fails
        logger.error('Failed to log email error:', logError);
      }

      // Create notification for failed email send
      try {
        const { notifyEmailFailed } = await import('./notificationService');
        await notifyEmailFailed(userId, emailData.to, emailData.subject, errorMessage, emailLogId);
      } catch (notifError) {
        logger.error('Failed to create email failed notification', notifError);
        // Don't fail if notification creation fails
      }

      // Throw a more user-friendly error
      const userFriendlyError = new Error(errorMessage);
      if (error?.statusCode) {
        (userFriendlyError as any).statusCode = error.statusCode;
      }
      throw userFriendlyError;
    }
  }

  /**
   * Send bulk transactional emails
   * @param emails - Array of email data
   * @param userId - User ID sending the emails
   * @param userRole - Role of the user sending the emails
   * @param options - Send options
   * @returns Promise<EmailBulkSendResult>
   */
  async sendBulkTransactionalEmails(
    emails: EmailSendRequest[],
    userId: string,
    userRole: 'admin' | 'sales',
    options: EmailSendOptions = {}
  ): Promise<EmailBulkSendResult> {
    const results: EmailSendResult[] = [];
    const errors: EmailError[] = [];

    logger.info('Starting bulk transactional email sending:', {
      userId,
      userRole,
      emailCount: emails.length,
    });

    for (let i = 0; i < emails.length; i++) {
      try {
        const result = await this.sendTransactionalEmail(emails[i], userId, userRole, options);
        results.push(result);

        // Add delay between emails to avoid rate limiting
        if (i < emails.length - 1 && !options.queue) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
      } catch (error) {
        const errorInfo: EmailError = {
          index: i,
          to: emails[i].to,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        errors.push(errorInfo);
      }
    }

    logger.info('Bulk transactional email sending completed:', {
      userId,
      userRole,
      successful: results.length,
      failed: errors.length,
      total: emails.length,
    });

    return {
      success: errors.length === 0,
      totalEmails: emails.length,
      successfulEmails: results.length,
      failedEmails: errors.length,
      results,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create email campaign
   * @param campaignData - Campaign data
   * @param userId - User ID creating the campaign
   * @param userRole - Role of the user creating the campaign
   * @param options - Campaign options
   * @returns Promise<EmailCampaignResult>
   */
  async createEmailCampaign(
    campaignData: EmailCampaignRequest,
    userId: string,
    userRole: 'admin' | 'sales',
    options: EmailCampaignOptions = {}
  ): Promise<EmailCampaignResult> {
    try {
      // Only admin users can create campaigns
      if (userRole !== 'admin') {
        throw new Error('Only admin users can create email campaigns');
      }

      // Prepare Brevo campaign data
      const brevoCampaignData: BrevoCampaignData = {
        name: campaignData.name,
        subject: campaignData.subject,
        sender: campaignData.sender,
        htmlContent: campaignData.htmlContent,
        textContent: campaignData.textContent,
        listIds: campaignData.listIds,
        scheduledAt: campaignData.scheduledAt,
        tags: campaignData.tags,
      };

      let result: BrevoCampaignResponse;

      if (options.queue) {
        // Add to queue for async processing
        const job = await emailQueueManager.addCampaignEmail(
          brevoCampaignData,
          'create',
          options.delay
        );

        // Log the campaign in database
        const campaignLog = await this.logCampaign({
          userId,
          userRole,
          name: campaignData.name,
          subject: campaignData.subject,
          status: 'queued',
          jobId: job.id,
        });

        logger.info('Email campaign creation queued successfully:', {
          userId,
          userRole,
          campaignName: campaignData.name,
          jobId: job.id,
          logId: campaignLog.id,
        });

        return {
          success: true,
          campaignId: job.id,
          status: 'queued',
          logId: campaignLog.id,
          timestamp: new Date().toISOString(),
        };
      } else {
        // Create immediately
        result = await brevoClient.createEmailCampaign(brevoCampaignData);

        // Log the campaign in database
        const campaignLog = await this.logCampaign({
          userId,
          userRole,
          name: campaignData.name,
          subject: campaignData.subject,
          status: 'created',
          campaignId: result.campaignId,
          brevoResponse: result,
        });

        logger.info('Email campaign created successfully:', {
          userId,
          userRole,
          campaignName: campaignData.name,
          campaignId: result.campaignId,
          logId: campaignLog.id,
        });

        return {
          success: true,
          campaignId: result.campaignId,
          status: result.status,
          logId: campaignLog.id,
          timestamp: result.timestamp,
        };
      }
    } catch (error) {
      logger.error('Failed to create email campaign:', {
        userId,
        userRole,
        campaignName: campaignData.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Log failed campaign attempt
      await this.logCampaign({
        userId,
        userRole,
        name: campaignData.name,
        subject: campaignData.subject,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Send email campaign
   * @param campaignId - Campaign ID
   * @param userId - User ID sending the campaign
   * @param userRole - Role of the user sending the campaign
   * @returns Promise<EmailSendResult>
   */
  async sendEmailCampaign(
    campaignId: number,
    userId: string,
    userRole: 'admin' | 'sales'
  ): Promise<EmailSendResult> {
    try {
      // Only admin users can send campaigns
      if (userRole !== 'admin') {
        throw new Error('Only admin users can send email campaigns');
      }

      const result = await brevoClient.sendEmailCampaign(campaignId);

      // Update campaign log
      await this.updateCampaignLog(campaignId, {
        status: 'sent',
        sentAt: new Date(),
        brevoResponse: result,
      });

      logger.info('Email campaign sent successfully:', {
        userId,
        userRole,
        campaignId,
        messageId: result.messageId,
      });

      // Fetch the log ID
      const campaignLog = await prisma.emailCampaignLog.findFirst({
        where: { campaignId: String(campaignId) },
        select: { id: true }
      });

      return {
        success: true,
        messageId: result.messageId,
        status: result.status as any,
        method: result.method,
        logId: campaignLog?.id || '',
        timestamp: result.timestamp,
      };
    } catch (error) {
      logger.error('Failed to send email campaign:', {
        userId,
        userRole,
        campaignId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Update campaign log with error
      await this.updateCampaignLog(campaignId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Get email history
   * @param userId - User ID
   * @param userRole - Role of the user
   * @param filters - Optional filters
   * @returns Promise<EmailHistoryResult>
   */
  async getEmailHistory(
    userId: string,
    userRole: 'admin' | 'sales',
    filters?: EmailHistoryFilters
  ): Promise<EmailHistoryResult> {
    try {
      const whereClause: any = {};

      // If sales user, only show their emails
      if (userRole === 'sales') {
        whereClause.userId = userId;
      }

      // Apply additional filters
      if (filters?.to) {
        whereClause.to = {
          contains: filters.to,
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

      const emails = await prisma.emailLog.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });

      const totalCount = await prisma.emailLog.count({
        where: whereClause,
      });

      const mappedEmails = emails.map(email => ({
        ...email,
        messageId: email.messageId || undefined,
        jobId: email.jobId || undefined,
        error: email.error || undefined,
        transport: (email.transport?.toLowerCase() as any) || 'api'
      }));

      return {
        success: true,
        emails: mappedEmails,
        totalCount,
        hasMore: (filters?.offset || 0) + emails.length < totalCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to get email history:', {
        userId,
        userRole,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get email statistics
   * @param userId - User ID
   * @param userRole - Role of the user
   * @returns Promise<EmailStatisticsResult>
   */
  async getEmailStatistics(
    userId: string,
    userRole: 'admin' | 'sales'
  ): Promise<EmailStatisticsResult> {
    try {
      const whereClause: any = {};

      // If sales user, only show their statistics
      if (userRole === 'sales') {
        whereClause.userId = userId;
      }

      const [
        totalEmails,
        sentEmails,
        deliveredEmails,
        failedEmails,
        todayEmails,
        thisWeekEmails,
        thisMonthEmails,
      ] = await Promise.all([
        prisma.emailLog.count({ where: whereClause }),
        prisma.emailLog.count({ where: { ...whereClause, status: 'sent' } }),
        prisma.emailLog.count({ where: { ...whereClause, status: 'delivered' } }),
        prisma.emailLog.count({ where: { ...whereClause, status: 'failed' } }),
        prisma.emailLog.count({
          where: {
            ...whereClause,
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.emailLog.count({
          where: {
            ...whereClause,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.emailLog.count({
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
          totalEmails,
          sentEmails,
          deliveredEmails,
          failedEmails,
          todayEmails,
          thisWeekEmails,
          thisMonthEmails,
          successRate: totalEmails > 0 ? (sentEmails / totalEmails) * 100 : 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to get email statistics:', {
        userId,
        userRole,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get queue statistics
   * @returns Promise<EmailQueueStatsResult>
   */
  async getQueueStatistics(): Promise<EmailQueueStatsResult> {
    try {
      const stats = await emailQueueManager.getQueueStats();

      return {
        success: true,
        stats,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Failed to get queue statistics:', error);
      throw error;
    }
  }

  /**
   * Validate if sales user can send email to specific recipient
   * @param userId - The sales user ID
   * @param email - The email address to check
   */
  private async validateSalesUserAccess(userId: string, email: string): Promise<void> {
    // For now, allow sales users to send to any email
    // In the future, you can implement email assignment logic here
    logger.info('Sales user email access validated:', {
      userId,
      email,
    });
  }

  /**
   * Log email in database
   * @param logData - The email log data
   * @returns Promise<EmailLog>
   */
  private async logEmail(logData: EmailLogData): Promise<EmailLog> {
    try {
      // Ensure the userId exists (avoid foreign key constraint violations)
      let resolvedUserId = logData.userId;

      try {
        const existingUser = await prisma.user.findUnique({ where: { id: logData.userId } });
        if (!existingUser) {
          // Find any active admin user
          let adminUser = await prisma.user.findFirst({ where: { role: 'admin', isActive: true } });
          if (!adminUser) {
            // Create a default system admin user if none exists
            adminUser = await prisma.user.create({
              data: {
                name: 'System Administrator',
                email: 'admin@upskillway.com',
                passwordHash: 'default-hash',
                role: 'admin',
                isActive: true,
              },
            });
            logger.info('Created default admin user for email logging:', { id: adminUser.id });
          }
          resolvedUserId = adminUser.id;
        }
      } catch (err) {
        // If user lookup fails for any reason, fallback to system admin (best-effort)
        const fallbackAdmin = await prisma.user.findFirst({ where: { role: 'admin', isActive: true } });
        if (fallbackAdmin) {
          resolvedUserId = fallbackAdmin.id;
        }
      }

      const emailLog = await prisma.emailLog.create({
        data: {
          userId: resolvedUserId,
          userRole: logData.userRole,
          to: logData.to,
          subject: logData.subject,
          // Map runtime string statuses/transports to Prisma enum values (uppercase)
          status: logData.status ? (logData.status.toUpperCase() as any) : undefined,
          messageId: logData.messageId,
          jobId: logData.jobId,
          transport: logData.transport ? (logData.transport.toUpperCase() as any) : undefined,
          brevoResponse: logData.brevoResponse,
          error: logData.error,
        },
      });

      return {
        ...emailLog,
        messageId: emailLog.messageId || undefined,
        jobId: emailLog.jobId || undefined,
        error: emailLog.error || undefined,
        transport: (emailLog.transport?.toLowerCase() as any) || 'api'
      };
    } catch (error) {
      logger.error('Failed to log email:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        logData,
      });
      throw error;
    }
  }

  /**
   * Log campaign in database
   * @param logData - The campaign log data
   * @returns Promise<EmailCampaignLog>
   */
  private async logCampaign(logData: EmailCampaignLogData): Promise<EmailCampaignLog> {
    try {
      const campaignLog = await prisma.emailCampaignLog.create({
        data: {
          userId: logData.userId,
          userRole: logData.userRole,
          name: logData.name,
          subject: logData.subject,
          status: logData.status ? logData.status.toUpperCase() as any : undefined,
          campaignId: logData.campaignId ? String(logData.campaignId) : undefined,
          jobId: logData.jobId,
          brevoResponse: logData.brevoResponse,
          error: logData.error,
        },
      });

      return {
        ...campaignLog,
        campaignId: campaignLog.campaignId || undefined,
        jobId: campaignLog.jobId || undefined,
        error: campaignLog.error || undefined,
        sentAt: campaignLog.sentAt || undefined
      };
    } catch (error) {
      logger.error('Failed to log campaign:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        logData,
      });
      throw error;
    }
  }

  /**
   * Update campaign log
   * @param campaignId - Campaign ID
   * @param updateData - Update data
   */
  private async updateCampaignLog(campaignId: number, updateData: any): Promise<void> {
    try {
      await prisma.emailCampaignLog.updateMany({
        where: { campaignId: campaignId.toString() },
        data: updateData,
      });
    } catch (error) {
      logger.error('Failed to update campaign log:', {
        campaignId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

// Export types
export interface EmailSendRequest {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  from?: {
    name: string;
    email: string;
  };
  replyTo?: {
    name: string;
    email: string;
  };
  attachments?: Array<{
    name: string;
    content: string; // Base64 encoded
  }>;
  headers?: Record<string, string>;
  tags?: string[];
  transport?: 'api' | 'smtp';
  queue?: boolean;
  delay?: number;
}

export interface EmailSendOptions {
  transport?: 'api' | 'smtp';
  queue?: boolean;
  delay?: number;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'queued' | 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED' | 'QUEUED';
  method: 'api' | 'smtp' | 'campaign';
  logId: string;
  timestamp: string;
}

export interface EmailBulkSendResult {
  success: boolean;
  totalEmails: number;
  successfulEmails: number;
  failedEmails: number;
  results: EmailSendResult[];
  errors: EmailError[];
  timestamp: string;
}

export interface EmailError {
  index: number;
  to: string;
  error: string;
}

export interface EmailCampaignRequest {
  name: string;
  subject: string;
  sender: {
    name: string;
    email: string;
  };
  htmlContent: string;
  textContent?: string;
  listIds?: number[];
  scheduledAt?: string;
  queue?: boolean;
  delay?: number;
  tags?: string[];
}

export interface EmailCampaignOptions {
  queue?: boolean;
  delay?: number;
}

export interface EmailCampaignResult {
  success: boolean;
  campaignId: number;
  status: 'created' | 'scheduled' | 'sent' | 'queued' | 'failed';
  logId: string;
  timestamp: string;
}

export interface EmailHistoryFilters {
  to?: string;
  status?: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'queued';
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface EmailHistoryResult {
  success: boolean;
  emails: EmailLog[];
  totalCount: number;
  hasMore: boolean;
  timestamp: string;
}

export interface EmailStatisticsResult {
  success: boolean;
  statistics: {
    totalEmails: number;
    sentEmails: number;
    deliveredEmails: number;
    failedEmails: number;
    todayEmails: number;
    thisWeekEmails: number;
    thisMonthEmails: number;
    successRate: number;
  };
  timestamp: string;
}

export interface EmailQueueStatsResult {
  success: boolean;
  stats: any;
  timestamp: string;
}

export interface EmailLogData {
  userId: string;
  userRole: 'admin' | 'sales';
  to: string;
  subject: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'queued';
  messageId?: string;
  jobId?: string;
  transport: 'api' | 'smtp';
  brevoResponse?: any;
  error?: string;
}

export interface EmailLog {
  id: string;
  userId: string;
  userRole: 'admin' | 'sales';
  to: string;
  subject: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'queued' | 'SENT' | 'DELIVERED' | 'OPENED' | 'CLICKED' | 'BOUNCED' | 'FAILED' | 'QUEUED';
  messageId?: string;
  jobId?: string;
  transport: 'api' | 'smtp';
  brevoResponse?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaignLogData {
  userId: string;
  userRole: 'admin' | 'sales';
  name: string;
  subject: string;
  status: 'created' | 'scheduled' | 'sent' | 'queued' | 'failed';
  campaignId?: number;
  jobId?: string;
  brevoResponse?: any;
  error?: string;
}

export interface EmailCampaignLog {
  id: string;
  userId: string;
  userRole: 'admin' | 'sales';
  name: string;
  subject: string;
  status: 'created' | 'scheduled' | 'sent' | 'queued' | 'failed' | 'CREATED' | 'SCHEDULED' | 'SENT' | 'QUEUED' | 'FAILED';
  campaignId?: string;
  jobId?: string;
  brevoResponse?: any;
  error?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
