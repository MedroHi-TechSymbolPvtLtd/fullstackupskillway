import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import { emailService } from './emailService';
import * as emailTemplateService from './emailTemplateService';
import { SendEmailToLeadInput, SendEmailToAllLeadsInput } from '../validators/leadEmail';
import { notifyEmailSent, notifyEmailFailed, notifyBulkEmailCompleted } from './notificationService';

/**
 * Lead Email Service
 * Handles sending emails to leads (single or bulk)
 */

/**
 * Send email to a specific lead
 */
export const sendEmailToLead = async (
  input: SendEmailToLeadInput,
  userId: string,
  userRole: 'admin' | 'sales'
) => {
  try {
    let lead;
    let email: string;
    let leadName: string | undefined;

    // Get lead data
    if (input.leadId) {
      lead = await prisma.lead.findUnique({
        where: { id: input.leadId },
      });

      if (!lead) {
        throw new NotFoundError('Lead not found');
      }

      email = lead.email;
      leadName = lead.name || undefined;
    } else if (input.email) {
      email = input.email;
      // Try to find lead by email
      const lead = await prisma.lead.findFirst({
        where: { email: input.email },
      });
      leadName = lead?.name || undefined;
    } else {
      throw new BadRequestError('Either leadId or email must be provided');
    }

    // Prepare email data
    let emailData: {
      to: string;
      toName?: string;
      subject: string;
      html: string;
      text?: string;
    };

    if (input.templateId) {
      // Use template
      const template = await emailTemplateService.getEmailTemplateById(input.templateId);

      if (!template.isActive) {
        throw new BadRequestError('Template is not active');
      }

      // Render template with lead data
      const variables = {
        name: leadName || 'there',
        email: email,
        organization: lead?.organization || '',
        stage: lead?.stage || '',
        status: lead?.status || '',
      };

      const rendered = emailTemplateService.renderTemplate(template, variables);

      emailData = {
        to: email,
        toName: leadName,
        subject: template.subject,
        html: rendered.html,
        text: rendered.text,
      };
    } else if (input.subject && input.html) {
      // Use provided subject and HTML
      emailData = {
        to: email,
        toName: leadName,
        subject: input.subject,
        html: input.html,
        text: input.text,
      };
    } else {
      throw new BadRequestError('Either templateId or both subject and html must be provided');
    }

    // Send email
    const result = await emailService.sendTransactionalEmail(
      emailData,
      userId,
      userRole,
      { queue: true }
    );

    // Create notification
    try {
      await notifyEmailSent(userId, email, emailData.subject, result.logId, lead?.id);
    } catch (notifError) {
      logger.error('Failed to create notification', notifError);
      // Don't fail the email send if notification fails
    }

    logger.info(`Email sent to lead: ${email} by user ${userId}`);
    return {
      success: true,
      email,
      leadId: lead?.id,
      result,
    };
  } catch (error) {
    logger.error('Send email to lead failed', error);

    // Create failure notification if we have the email
    if (input.email || input.leadId) {
      try {
        const email = input.email || (await prisma.lead.findUnique({ where: { id: input.leadId! } }))?.email;
        if (email) {
          await notifyEmailFailed(
            userId,
            email,
            input.subject || 'Email',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      } catch (notifError) {
        logger.error('Failed to create failure notification', notifError);
      }
    }

    throw error;
  }
};

/**
 * Send email to all leads
 */
export const sendEmailToAllLeads = async (
  input: SendEmailToAllLeadsInput,
  userId: string,
  userRole: 'admin' | 'sales'
) => {
  try {
    // Prepare email data
    let emailData: {
      subject: string;
      html: string;
      text?: string;
    };

    if (input.templateId) {
      // Use template
      const template = await emailTemplateService.getEmailTemplateById(input.templateId);

      if (!template.isActive) {
        throw new BadRequestError('Template is not active');
      }

      emailData = {
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent || undefined,
      };
    } else if (input.subject && input.html) {
      // Use provided subject and HTML
      emailData = {
        subject: input.subject,
        html: input.html,
        text: input.text,
      };
    } else {
      throw new BadRequestError('Either templateId or both subject and html must be provided');
    }

    // Build where clause for filtering leads
    const where: any = {};
    if (input.filters) {
      if (input.filters.stage) {
        where.stage = input.filters.stage;
      }
      if (input.filters.status) {
        where.status = input.filters.status;
      }
      if (input.filters.source) {
        where.source = input.filters.source;
      }
      if (input.filters.assignedToId) {
        where.assignedToId = input.filters.assignedToId;
      }
    }

    // Get all leads matching filters
    const leads = await prisma.lead.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        organization: true,
        stage: true,
        status: true,
      },
    });

    if (leads.length === 0) {
      throw new BadRequestError('No leads found matching the filters');
    }

    logger.info(`Sending bulk email to ${leads.length} leads`);

    // Send emails to all leads
    const results = [];
    const errors = [];

    for (const lead of leads) {
      try {
        // Render template with lead data if using template
        let finalHtml = emailData.html;
        let finalText = emailData.text;

        if (input.templateId) {
          const variables = {
            name: lead.name || 'there',
            email: lead.email,
            organization: lead.organization || '',
            stage: lead.stage || '',
            status: lead.status || '',
          };

          const rendered = emailTemplateService.renderTemplate(
            { htmlContent: emailData.html, textContent: emailData.text },
            variables
          );
          finalHtml = rendered.html;
          finalText = rendered.text;
        }

        const result = await emailService.sendTransactionalEmail(
          {
            to: lead.email,
            toName: lead.name || undefined,
            subject: emailData.subject,
            html: finalHtml,
            text: finalText,
          },
          userId,
          userRole,
          { queue: true }
        );

        results.push({
          leadId: lead.id,
          email: lead.email,
          success: true,
          result,
        });
      } catch (error) {
        errors.push({
          leadId: lead.id,
          email: lead.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Create bulk completion notification
    try {
      await notifyBulkEmailCompleted(userId, leads.length, results.length, errors.length);
    } catch (notifError) {
      logger.error('Failed to create bulk email notification', notifError);
    }

    logger.info(`Bulk email completed: ${results.length} sent, ${errors.length} failed`);

    return {
      success: true,
      total: leads.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors,
    };
  } catch (error) {
    logger.error('Send email to all leads failed', error);
    throw error;
  }
};





