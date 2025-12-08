import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import {
  CreateEmailAutomationInput,
  UpdateEmailAutomationInput,
  EmailAutomationQueryInput,
} from '../validators/emailAutomation';
import { AutomationTrigger, AutomationStatus } from '@prisma/client';
import { emailService } from './emailService';
import * as emailTemplateService from './emailTemplateService';
import { notifyAutomationTriggered, notifyAutomationFailed } from './notificationService';

/**
 * Email Automation Service
 * Handles CRUD operations for email automations and execution
 */

/**
 * Create email automation
 */
export const createEmailAutomation = async (
  automationData: CreateEmailAutomationInput,
  userId: string
) => {
  try {
    // Verify template exists
    const template = await prisma.emailTemplate.findUnique({
      where: { id: automationData.templateId },
    });

    if (!template) {
      throw new NotFoundError('Email template not found');
    }

    if (!template.isActive) {
      throw new BadRequestError('Cannot create automation with inactive template');
    }

    const automation = await prisma.emailAutomation.create({
      data: {
        ...automationData,
        createdBy: userId,
      },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Email automation created: ${automation.id} by user ${userId}`);
    return automation;
  } catch (error) {
    logger.error('Create email automation failed', error);
    throw error;
  }
};

/**
 * Get all email automations
 */
export const getAllEmailAutomations = async (queryParams: EmailAutomationQueryInput) => {
  try {
    const { page, limit, search, triggerType, isActive } = queryParams;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (triggerType) {
      where.triggerType = triggerType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [automations, total] = await Promise.all([
      prisma.emailAutomation.findMany({
        where,
        skip,
        take: limit,
        include: {
          template: {
            select: {
              id: true,
              name: true,
              subject: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              executionLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.emailAutomation.count({ where }),
    ]);

    return {
      automations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error('Get all email automations failed', error);
    throw error;
  }
};

/**
 * Get email automation by ID
 */
export const getEmailAutomationById = async (automationId: string) => {
  try {
    const automation = await prisma.emailAutomation.findUnique({
      where: { id: automationId },
      include: {
        template: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        executionLogs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!automation) {
      throw new NotFoundError('Email automation not found');
    }

    return automation;
  } catch (error) {
    logger.error(`Get email automation by ID failed: ${automationId}`, error);
    throw error;
  }
};

/**
 * Update email automation
 */
export const updateEmailAutomation = async (
  automationId: string,
  automationData: UpdateEmailAutomationInput
) => {
  try {
    const existingAutomation = await prisma.emailAutomation.findUnique({
      where: { id: automationId },
    });

    if (!existingAutomation) {
      throw new NotFoundError('Email automation not found');
    }

    // If template is being updated, verify it exists and is active
    if (automationData.templateId) {
      const template = await prisma.emailTemplate.findUnique({
        where: { id: automationData.templateId },
      });

      if (!template) {
        throw new NotFoundError('Email template not found');
      }

      if (!template.isActive) {
        throw new BadRequestError('Cannot use inactive template');
      }
    }

    const automation = await prisma.emailAutomation.update({
      where: { id: automationId },
      data: automationData,
      include: {
        template: {
          select: {
            id: true,
            name: true,
            subject: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Email automation updated: ${automationId}`);
    return automation;
  } catch (error) {
    logger.error(`Update email automation failed: ${automationId}`, error);
    throw error;
  }
};

/**
 * Delete email automation
 */
export const deleteEmailAutomation = async (automationId: string) => {
  try {
    const automation = await prisma.emailAutomation.findUnique({
      where: { id: automationId },
    });

    if (!automation) {
      throw new NotFoundError('Email automation not found');
    }

    await prisma.emailAutomation.delete({
      where: { id: automationId },
    });

    logger.info(`Email automation deleted: ${automationId}`);
    return { message: 'Email automation deleted successfully' };
  } catch (error) {
    logger.error(`Delete email automation failed: ${automationId}`, error);
    throw error;
  }
};

/**
 * Execute automation for a lead
 * This is called when a trigger event occurs (e.g., lead created, stage changed)
 */
export const executeAutomation = async (
  automationId: string,
  leadId: string,
  leadData: {
    email: string;
    name?: string | null;
    organization?: string | null;
    stage?: string;
    status?: string;
    [key: string]: any;
  }
) => {
  try {
    const automation = await prisma.emailAutomation.findUnique({
      where: { id: automationId },
      include: {
        template: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!automation) {
      throw new NotFoundError('Email automation not found');
    }

    if (!automation.isActive) {
      logger.info(`Automation ${automationId} is inactive, skipping execution`);
      return { skipped: true, reason: 'Automation is inactive' };
    }

    if (!automation.template.isActive) {
      logger.info(`Template for automation ${automationId} is inactive, skipping execution`);
      return { skipped: true, reason: 'Template is inactive' };
    }

    // Check trigger conditions
    if (!checkTriggerCondition(automation.triggerType, automation.triggerCondition, leadData)) {
      logger.info(`Trigger condition not met for automation ${automationId}`);
      return { skipped: true, reason: 'Trigger condition not met' };
    }

    // Create automation log entry
    const logEntry = await prisma.emailAutomationLog.create({
      data: {
        automationId,
        leadId,
        email: leadData.email,
        status: 'PENDING',
      },
    });

    // Calculate delay
    const delayMs = (automation.delayMinutes || 0) * 60 * 1000;

    // Render template with lead data
    const variables = {
      name: leadData.name || 'there',
      email: leadData.email,
      organization: leadData.organization || '',
      stage: leadData.stage || '',
      status: leadData.status || '',
    };

    const { html, text } = emailTemplateService.renderTemplate(
      { htmlContent: automation.template.htmlContent, textContent: automation.template.textContent },
      variables
    );

    // Schedule email sending (with delay if specified)
    const sendEmail = async () => {
      try {
        const result = await emailService.sendTransactionalEmail(
          {
            to: leadData.email,
            toName: leadData.name || undefined,
            subject: automation.template.subject,
            html,
            text,
          },
          automation.user.id,
          'admin',
          { queue: true, delay: delayMs }
        );

        // Update log entry
        await prisma.emailAutomationLog.update({
          where: { id: logEntry.id },
          data: {
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        // Send notification
        await notifyAutomationTriggered(automation.user.id, automation.name, leadId, leadData.email);

        logger.info(`Automation ${automationId} executed successfully for lead ${leadId}`);
        return { success: true, logId: logEntry.id, emailResult: result };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Update log entry with error
        await prisma.emailAutomationLog.update({
          where: { id: logEntry.id },
          data: {
            status: 'FAILED',
            error: errorMessage,
          },
        });

        // Send notification
        await notifyAutomationFailed(automation.user.id, automation.name, leadId, errorMessage);

        logger.error(`Automation ${automationId} execution failed for lead ${leadId}`, error);
        throw error;
      }
    };

    // Execute immediately or with delay
    if (delayMs > 0) {
      setTimeout(sendEmail, delayMs);
      return { success: true, logId: logEntry.id, scheduled: true, delayMinutes: automation.delayMinutes };
    } else {
      return await sendEmail();
    }
  } catch (error) {
    logger.error(`Execute automation failed: ${automationId}`, error);
    throw error;
  }
};

/**
 * Check if trigger condition is met
 */
const checkTriggerCondition = (
  triggerType: AutomationTrigger,
  triggerCondition: any,
  leadData: any
): boolean => {
  switch (triggerType) {
    case AutomationTrigger.LEAD_CREATED:
      return true; // Always trigger on lead creation

    case AutomationTrigger.LEAD_STAGE_CHANGED:
      if (triggerCondition?.stage) {
        return leadData.stage === triggerCondition.stage;
      }
      return true; // Trigger on any stage change if no specific stage is set

    case AutomationTrigger.LEAD_STATUS_CHANGED:
      if (triggerCondition?.status) {
        return leadData.status === triggerCondition.status;
      }
      return true; // Trigger on any status change if no specific status is set

    case AutomationTrigger.LEAD_ASSIGNED:
      return true; // Always trigger on assignment

    case AutomationTrigger.LEAD_CONVERTED:
      return leadData.stage === 'CONVERTED' || leadData.status === 'CONVERTED';

    case AutomationTrigger.CUSTOM:
      // Custom conditions can be defined in triggerCondition
      if (triggerCondition) {
        // Example: { stage: 'CONTACTED', status: 'ACTIVE' }
        return Object.keys(triggerCondition).every(
          (key) => leadData[key] === triggerCondition[key]
        );
      }
      return false;

    default:
      return false;
  }
};

/**
 * Get automation execution logs
 */
export const getAutomationLogs = async (
  automationId: string,
  options: { page?: number; limit?: number } = {}
) => {
  try {
    const { page = 1, limit = 20 } = options;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.emailAutomationLog.findMany({
        where: { automationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.emailAutomationLog.count({ where: { automationId } }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error(`Get automation logs failed: ${automationId}`, error);
    throw error;
  }
};

