import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import {
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
  EmailTemplateQueryInput,
} from '../validators/emailTemplate';

/**
 * Email Template Service
 * Handles CRUD operations for email templates
 */

/**
 * Create email template
 */
export const createEmailTemplate = async (
  templateData: CreateEmailTemplateInput,
  userId: string
) => {
  try {
    const template = await prisma.emailTemplate.create({
      data: {
        ...templateData,
        createdBy: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Email template created: ${template.id} by user ${userId}`);
    return template;
  } catch (error) {
    logger.error('Create email template failed', error);
    throw error;
  }
};

/**
 * Get all email templates
 */
export const getAllEmailTemplates = async (queryParams: EmailTemplateQueryInput) => {
  try {
    const { page, limit, search, category, isActive } = queryParams;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [templates, total] = await Promise.all([
      prisma.emailTemplate.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              automations: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.emailTemplate.count({ where }),
    ]);

    return {
      templates,
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
    logger.error('Get all email templates failed', error);
    throw error;
  }
};

/**
 * Get email template by ID
 */
export const getEmailTemplateById = async (templateId: string) => {
  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        automations: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            triggerType: true,
            isActive: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundError('Email template not found');
    }

    return template;
  } catch (error) {
    logger.error(`Get email template by ID failed: ${templateId}`, error);
    throw error;
  }
};

/**
 * Update email template
 */
export const updateEmailTemplate = async (
  templateId: string,
  templateData: UpdateEmailTemplateInput
) => {
  try {
    const existingTemplate = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!existingTemplate) {
      throw new NotFoundError('Email template not found');
    }

    const template = await prisma.emailTemplate.update({
      where: { id: templateId },
      data: templateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Email template updated: ${templateId}`);
    return template;
  } catch (error) {
    logger.error(`Update email template failed: ${templateId}`, error);
    throw error;
  }
};

/**
 * Delete email template
 */
export const deleteEmailTemplate = async (templateId: string) => {
  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
      include: {
        _count: {
          select: {
            automations: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundError('Email template not found');
    }

    // Check if template is used in active automations
    if (template._count.automations > 0) {
      throw new BadRequestError(
        'Cannot delete template that is used in active automations. Please deactivate or delete the automations first.'
      );
    }

    await prisma.emailTemplate.delete({
      where: { id: templateId },
    });

    logger.info(`Email template deleted: ${templateId}`);
    return { message: 'Email template deleted successfully' };
  } catch (error) {
    logger.error(`Delete email template failed: ${templateId}`, error);
    throw error;
  }
};

/**
 * Get template by category
 */
export const getTemplatesByCategory = async (category: string) => {
  try {
    const templates = await prisma.emailTemplate.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return templates;
  } catch (error) {
    logger.error(`Get templates by category failed: ${category}`, error);
    throw error;
  }
};

/**
 * Render template with variables
 * Supports variables like {{name}}, {{email}}, {{organization}}, etc.
 */
export const renderTemplate = (
  template: { htmlContent: string; textContent?: string | null },
  variables: Record<string, string | undefined>
): { html: string; text?: string } => {
  let html = template.htmlContent;
  let text = template.textContent || '';

  // Replace variables in format {{variableName}}
  Object.keys(variables).forEach((key) => {
    const value = variables[key] || '';
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, value);
    text = text.replace(regex, value);
  });

  return { html, text: text || undefined };
};





