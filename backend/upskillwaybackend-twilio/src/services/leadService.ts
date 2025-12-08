import { prisma } from '../config/database';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import { CreateLeadInput, UpdateLeadInput, UpdateLeadStatusInput, AssignLeadInput, LeadQueryInput } from '../validators/lead';
import { LeadStage, LeadStatus, ActivityType } from '@prisma/client';

/**
 * Lead service
 * Handles lead capture and management operations
 */

// Utility function to validate UUID format
const validateUUID = (id: string): void => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new BadRequestError('Invalid lead ID format');
  }
};

// Create lead service (public form)
export const createLead = async (leadData: CreateLeadInput) => {
  try {
    const lead = await prisma.lead.create({
      data: leadData,
    });

    logger.info(`Lead created: ${lead.email}`);

    // Automatically send WhatsApp message to new lead if phone number is provided
    if (lead.phone) {
      try {
        const whatsappService = (await import('./whatsappService')).whatsappService;

        // Find an admin user for automated messages (or use the first admin user)
        const adminUser = await prisma.user.findFirst({
          where: { role: 'admin', isActive: true },
          select: { id: true },
        });

        if (adminUser) {
          await whatsappService.sendAutomatedMessage(
            {
              phoneNumber: lead.phone,
              message: `Welcome message to ${lead.name}`,
              contentSid: process.env.TWILIO_TEMPLATE_WELCOME,
              contentVariables: {
                '1': lead.name || 'there',
              },
              firstName: lead.name?.split(' ')[0] || '',
              lastName: lead.name?.split(' ').slice(1).join(' ') || '',
              email: lead.email,
              languageCode: 'en',
              country: 'IN',
            },
            adminUser.id
          ).catch((error) => {
            // Log error but don't fail lead creation if WhatsApp fails
            logger.error('Failed to send automated WhatsApp to new lead:', {
              leadId: lead.id,
              phone: lead.phone,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          });
        } else {
          logger.warn('No admin user found for automated WhatsApp message to new lead:', {
            leadId: lead.id,
            phone: lead.phone,
          });
        }
      } catch (error) {
        // Log error but don't fail lead creation if WhatsApp import fails
        logger.error('WhatsApp automation not available for new lead:', {
          leadId: lead.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Trigger email automations for new lead
    if (lead.email) {
      try {
        const { AutomationTrigger } = await import('@prisma/client');
        const { executeAutomation } = await import('./emailAutomationService');

        // Find all active automations with LEAD_CREATED trigger
        const automations = await prisma.emailAutomation.findMany({
          where: {
            triggerType: AutomationTrigger.LEAD_CREATED,
            isActive: true,
            template: {
              isActive: true,
            },
          },
          include: {
            template: true,
          },
        });

        // Execute each automation
        for (const automation of automations) {
          if (automation.template) {
            executeAutomation(automation.id, lead.id, {
              email: lead.email,
              name: lead.name,
              organization: lead.organization,
              stage: lead.stage,
              status: lead.status,
            }).catch((error) => {
              logger.error(`Failed to execute automation ${automation.id} for new lead:`, {
                leadId: lead.id,
                automationId: automation.id,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            });
          }
        }
      } catch (error) {
        logger.error('Email automation not available for new lead:', {
          leadId: lead.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return lead;
  } catch (error) {
    logger.error('Create lead failed', error);
    throw error;
  }
};

// Get all leads service (admin/sales only)
export const getAllLeads = async (queryParams: LeadQueryInput) => {
  try {
    const { page, limit, search, stage, status, priority, assignedTo, collegeId, source } = queryParams;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (stage) where.stage = stage;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedToId = assignedTo;
    if (collegeId) where.collegeId = collegeId;
    if (source) where.source = source;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          college: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
          _count: {
            select: {
              activities: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      leads,
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
    logger.error('Get all leads failed', error);
    throw error;
  }
};

// Get lead by ID service
export const getLeadById = async (leadId: string) => {
  try {
    validateUUID(leadId);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            type: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    return lead;
  } catch (error) {
    logger.error(`Get lead by ID failed: ${leadId}`, error);
    throw error;
  }
};

// Update lead service (admin only)
export const updateLead = async (leadId: string, leadData: UpdateLeadInput) => {
  try {
    validateUUID(leadId);

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: leadData,
    });

    logger.info(`Lead updated: ${lead.email}`);

    return lead;
  } catch (error) {
    logger.error(`Update lead failed: ${leadId}`, error);
    throw error;
  }
};

// Delete lead service (admin only)
export const deleteLead = async (leadId: string) => {
  try {
    validateUUID(leadId);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    await prisma.lead.delete({
      where: { id: leadId },
    });

    logger.info(`Lead deleted: ${lead.email}`);

    return { message: 'Lead deleted successfully' };
  } catch (error) {
    logger.error(`Delete lead failed: ${leadId}`, error);
    throw error;
  }
};

// Update lead status service (admin/sales only)
export const updateLeadStatus = async (leadId: string, statusData: UpdateLeadStatusInput, performedBy: string) => {
  try {
    validateUUID(leadId);

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { college: true },
    });

    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    const { stage, status, notes, nextFollowUp, value } = statusData;
    const previousStage = existingLead.stage;
    const previousStatus = existingLead.status;

    // Prepare update data
    const updateData: any = {
      stage,
      lastContactAt: new Date(),
    };

    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (nextFollowUp) updateData.nextFollowUp = new Date(nextFollowUp);
    if (value !== undefined) updateData.value = value;

    // Check if lead is being converted (stage = CONVERT/CONVERTED OR status = CONVERTED)
    const isConverting = stage === 'CONVERT' || (stage as string) === 'CONVERTED' || status === 'CONVERTED';

    if (isConverting) {
      updateData.status = 'CONVERTED';
      updateData.stage = 'CONVERTED';
      updateData.convertedAt = new Date();
    }

    // Use transaction to update lead and create college if converting
    const result = await prisma.$transaction(async (tx) => {
      let createdCollege = null;
      let conversionWarning: string | null = null;

      // Auto-create college if lead is being converted and doesn't have a college yet
      if (isConverting && !existingLead.collegeId) {
        if (!existingLead.organization || existingLead.organization.trim() === '') {
          // Warn if organization is missing
          conversionWarning = 'Lead converted but college not created: organization field is missing. Please add organization field and try again, or create college manually.';
          logger.warn(`Lead ${leadId} converted without organization field - college not created`);
        } else {
          try {
            // Check if college with this name already exists
            const existingCollege = await tx.college.findFirst({
              where: { name: existingLead.organization },
            });

            if (existingCollege) {
              // Link to existing college
              updateData.collegeId = existingCollege.id;
              logger.info(`Lead ${leadId} linked to existing college: ${existingCollege.name}`);
            } else {
              // Create new college from lead data
              createdCollege = await tx.college.create({
                data: {
                  name: existingLead.organization,
                  contactPerson: existingLead.name || undefined,
                  contactEmail: existingLead.email,
                  contactPhone: existingLead.phone || undefined,
                  status: 'PROSPECTIVE',
                  // assignedToId is intentionally left null - will be assigned manually later
                },
              });

              updateData.collegeId = createdCollege.id;
              logger.info(`Auto-created college from lead: ${createdCollege.name}`);
            }
          } catch (error) {
            logger.error('Failed to auto-create college from lead:', error);
            conversionWarning = `Lead converted but college creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
            // Continue with lead conversion even if college creation fails
          }
        }
      } else if (isConverting && existingLead.collegeId) {
        // Lead already has a college - just update college status
        logger.info(`Lead ${leadId} already has college ${existingLead.collegeId} - updating college status`);
      }

      // Update the lead
      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: updateData,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          college: {
            select: {
              id: true,
              name: true,
              city: true,
              status: true,
            },
          },
        },
      });

      // Create activity log for stage change
      await tx.leadActivity.create({
        data: {
          leadId,
          type: ActivityType.STAGE_CHANGE,
          description: `Lead stage changed from ${previousStage} to ${stage}${isConverting ? ' - Lead CONVERTED' : ''}`,
          notes: notes || `Stage updated to ${stage}`,
          performedBy,
        },
      });

      // Create activity log for college creation
      if (createdCollege) {
        await tx.leadActivity.create({
          data: {
            leadId,
            type: ActivityType.NOTE,
            description: `College "${createdCollege.name}" automatically created from converted lead`,
            notes: 'College can now be assigned a trainer manually',
            performedBy: 'system',
          },
        });
      }

      // If lead already had a college and is being converted, update college status
      if (isConverting && existingLead.collegeId) {
        await tx.college.update({
          where: { id: existingLead.collegeId },
          data: {
            status: 'ACTIVE',
            lastTrainingAt: new Date(),
          },
        });

        await tx.leadActivity.create({
          data: {
            leadId,
            type: ActivityType.NOTE,
            description: 'Lead converted - College status updated to ACTIVE',
            notes: 'Automatic college status update due to lead conversion',
            performedBy: 'system',
          },
        });
      }

      // Add warning to updatedLead if conversion had issues
      if (conversionWarning) {
        (updatedLead as any).conversionWarning = conversionWarning;
      }

      return updatedLead;
    });

    logger.info(`Lead status updated: ${leadId} - Stage: ${previousStage} → ${stage}, Status: ${previousStatus} → ${result.status}`);

    // Trigger email automations for stage/status changes
    if (result.email && (previousStage !== stage || previousStatus !== status)) {
      try {
        const { AutomationTrigger } = await import('@prisma/client');
        const { executeAutomation } = await import('./emailAutomationService');

        // Find automations for stage/status changes
        const triggerTypes = [];
        if (previousStage !== stage) {
          triggerTypes.push(AutomationTrigger.LEAD_STAGE_CHANGED);
        }
        if (previousStatus !== status) {
          triggerTypes.push(AutomationTrigger.LEAD_STATUS_CHANGED);
        }
        if (isConverting) {
          triggerTypes.push(AutomationTrigger.LEAD_CONVERTED);
        }

        if (triggerTypes.length > 0) {
          const automations = await prisma.emailAutomation.findMany({
            where: {
              triggerType: { in: triggerTypes as any },
              isActive: true,
              template: {
                isActive: true,
              },
            },
            include: {
              template: true,
            },
          });

          // Execute each automation
          for (const automation of automations) {
            if (automation.templateId) {
              executeAutomation(automation.id, result.id, {
                email: result.email,
                name: result.name,
                organization: result.organization,
                stage: result.stage,
                status: result.status,
              }).catch((error) => {
                logger.error(`Failed to execute automation ${automation.id} for lead status update:`, {
                  leadId: result.id,
                  automationId: automation.id,
                  error: error instanceof Error ? error.message : 'Unknown error',
                });
              });
            }
          }
        }
      } catch (error) {
        logger.error('Email automation not available for lead status update:', {
          leadId: result.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Add conversion warning to response if present
    if ((result as any).conversionWarning) {
      logger.warn(`Conversion warning for lead ${leadId}: ${(result as any).conversionWarning}`);
    }

    return result;
  } catch (error) {
    logger.error(`Update lead status failed: ${leadId}`, error);
    throw error;
  }
};

// Assign lead service (admin/sales only)
export const assignLead = async (leadId: string, assignmentData: AssignLeadInput, assignedBy: string) => {
  try {
    validateUUID(leadId);

    const existingLead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!existingLead) {
      throw new NotFoundError('Lead not found');
    }

    const { assignedToId, collegeId, priority, notes } = assignmentData;

    // Verify assigned user exists
    if (assignedToId) {
      const user = await prisma.user.findUnique({
        where: { id: assignedToId },
      });
      if (!user) {
        throw new NotFoundError('Assigned user not found');
      }
    }

    // Verify college exists if provided
    if (collegeId) {
      const college = await prisma.college.findUnique({
        where: { id: collegeId },
      });
      if (!college) {
        throw new NotFoundError('College not found');
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update the lead
      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: {
          assignedToId,
          collegeId,
          priority,
          notes,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          college: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
      });

      // Create activity log
      await tx.leadActivity.create({
        data: {
          leadId,
          type: 'ASSIGNMENT',
          description: `Lead assigned to ${assignedToId ? 'user' : 'unassigned'}${collegeId ? ' and linked to college' : ''}`,
          notes: notes || 'Lead assignment updated',
          performedBy: assignedBy,
        },
      });

      return updatedLead;
    });

    logger.info(`Lead assigned: ${leadId} - User: ${assignedToId}, College: ${collegeId}`);

    // Trigger email automations for lead assignment
    if (result.email && assignedToId) {
      try {
        const { AutomationTrigger } = await import('@prisma/client');
        const { executeAutomation } = await import('./emailAutomationService');

        // Find automations for lead assignment
        const automations = await prisma.emailAutomation.findMany({
          where: {
            triggerType: AutomationTrigger.LEAD_ASSIGNED,
            isActive: true,
            template: {
              isActive: true,
            },
          },
          include: {
            template: true,
          },
        });

        // Execute each automation
        for (const automation of automations) {
          if (automation.template) {
            executeAutomation(automation.id, result.id, {
              email: result.email,
              name: result.name,
              organization: result.organization,
              stage: result.stage,
              status: result.status,
            }).catch((error) => {
              logger.error(`Failed to execute automation ${automation.id} for lead assignment:`, {
                leadId: result.id,
                automationId: automation.id,
                error: error instanceof Error ? error.message : 'Unknown error',
              });
            });
          }
        }
      } catch (error) {
        logger.error('Email automation not available for lead assignment:', {
          leadId: result.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  } catch (error) {
    logger.error(`Assign lead failed: ${leadId}`, error);
    throw error;
  }
};

// Get lead statistics service (admin/sales only)
export const getLeadStats = async () => {
  try {
    const [
      totalLeads,
      leadsByStage,
      leadsBySource,
      leadsByStatus,
      recentLeads,
      conversionRate,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ['stage'],
        _count: true,
        orderBy: { _count: { stage: 'desc' } },
      }),
      prisma.lead.groupBy({
        by: ['source'],
        _count: {
          source: true,
        },
        orderBy: {
          _count: {
            source: 'desc',
          },
        },
      }),
      prisma.lead.groupBy({
        by: ['status'],
        _count: true,
        orderBy: { _count: { status: 'desc' } },
      }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          organization: true,
          source: true,
          stage: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.lead.aggregate({
        _count: {
          id: true,
        },
        where: {
          stage: 'CONVERT',
        },
      }),
    ]);

    const totalConverted = conversionRate._count.id;
    const conversionPercentage = totalLeads > 0 ? (totalConverted / totalLeads) * 100 : 0;

    return {
      totalLeads,
      totalConverted,
      conversionPercentage: Math.round(conversionPercentage * 100) / 100,
      leadsByStage: leadsByStage.map(item => ({
        stage: item.stage,
        count: item._count,
      })),
      leadsBySource: leadsBySource.map(item => ({
        source: item.source || 'Unknown',
        count: item._count.source,
      })),
      leadsByStatus: leadsByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
      recentLeads,
    };
  } catch (error) {
    logger.error('Get lead stats failed', error);
    throw error;
  }
};
