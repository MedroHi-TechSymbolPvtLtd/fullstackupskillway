import { prisma } from '../config/database';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors';
import { logger } from '../utils/logger';
import { LeadStage, Priority, ActivityType, CollegeType } from '@prisma/client';
import { UpdateCrmLeadInput } from '../validators/crm';

interface StageUpdateOptions {
  notes?: string;
  nextFollowUp?: Date;
  performedBy: string;
}

interface AssignmentOptions {
  notes?: string;
  assignedBy: string;
}

interface ConversionData {
  name: string;
  location?: string;
  city?: string;
  state?: string;
  type?: CollegeType;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  totalRevenue?: number;
}

interface RecycleOptions {
  notes?: string;
  recycledBy: string;
}

interface ActivityData {
  type: ActivityType;
  description: string;
  notes?: string;
  performedBy: string;
}

interface FunnelStatsFilters {
  dateFrom?: Date;
  dateTo?: Date;
  assignedTo?: string;
}

interface PerformanceStatsFilters {
  period: string;
  assignedTo?: string;
}

interface BulkAssignOptions {
  notes?: string;
  assignedBy: string;
}

interface MyLeadsFilters {
  stage?: string;
  priority?: string;
}

// Update lead stage
export const updateLeadStage = async (leadId: string, stage: LeadStage, options: StageUpdateOptions) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    // Validate stage transition
    const validTransitions = getValidStageTransitions(lead.stage);
    if (!validTransitions.includes(stage)) {
      throw new BadRequestError(`Invalid stage transition from ${lead.stage} to ${stage}`);
    }

    // Update lead stage
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        stage,
        lastContactAt: new Date(),
        nextFollowUp: options.nextFollowUp,
        notes: options.notes,
        updatedAt: new Date(),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add activity record
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: ActivityType.STAGE_CHANGE,
        description: `Stage changed from ${lead.stage} to ${stage}`,
        notes: options.notes,
        performedBy: options.performedBy,
      },
    });

    logger.info(`Lead stage updated: ${leadId} from ${lead.stage} to ${stage}`);
    return updatedLead;
  } catch (error) {
    logger.error(`Update lead stage failed: ${leadId}`, error);
    throw error;
  }
};

// Assign lead to sales person
export const assignLeadToSales = async (leadId: string, assignedToId: string, options: AssignmentOptions) => {
  try {
    const [lead, salesPerson] = await Promise.all([
      prisma.lead.findUnique({ where: { id: leadId } }),
      prisma.user.findUnique({ where: { id: assignedToId } }),
    ]);

    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    if (!salesPerson) {
      throw new NotFoundError('Sales person not found');
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        assignedToId,
        updatedAt: new Date(),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add activity record
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: ActivityType.ASSIGNMENT,
        description: `Lead assigned to ${salesPerson.name}`,
        notes: options.notes,
        performedBy: options.assignedBy,
      },
    });

    logger.info(`Lead assigned: ${leadId} to ${salesPerson.name}`);
    return updatedLead;
  } catch (error) {
    logger.error(`Assign lead failed: ${leadId}`, error);
    throw error;
  }
};

// Convert lead to college
export const convertLeadToCollege = async (leadId: string, collegeData: ConversionData, convertedBy: string) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    if (lead.stage !== 'CLOSED_WON') {
      throw new BadRequestError('Lead must be in CLOSED_WON stage to convert');
    }

    // Create college record
    const college = await prisma.college.create({
      data: {
        ...collegeData,
        assignedToId: lead.assignedToId,
        status: 'ACTIVE',
      },
    });

    // Update lead with conversion details
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'CONVERTED',
        convertedAt: new Date(),
        collegeId: college.id,
        updatedAt: new Date(),
      },
      include: {
        college: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add activity record
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: ActivityType.STAGE_CHANGE,
        description: `Lead converted to college: ${college.name}`,
        performedBy: convertedBy,
      },
    });

    logger.info(`Lead converted to college: ${leadId} -> ${college.id}`);
    return { lead: updatedLead, college };
  } catch (error) {
    logger.error(`Convert lead to college failed: ${leadId}`, error);
    throw error;
  }
};

// Recycle denied lead back to prospect
export const recycleLeadToProspect = async (leadId: string, options: RecycleOptions) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    if (lead.stage !== 'DENIED') {
      throw new BadRequestError('Only denied leads can be recycled');
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        stage: 'LEAD_GENERATED',
        status: 'RECYCLED',
        notes: options.notes,
        updatedAt: new Date(),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Add activity record
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: ActivityType.STAGE_CHANGE,
        description: 'Lead recycled from DENIED to LEAD_GENERATED',
        notes: options.notes,
        performedBy: options.recycledBy,
      },
    });

    logger.info(`Lead recycled: ${leadId}`);
    return updatedLead;
  } catch (error) {
    logger.error(`Recycle lead failed: ${leadId}`, error);
    throw error;
  }
};

// Get lead activities
export const getLeadActivities = async (leadId: string, page: number, limit: number) => {
  try {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.leadActivity.findMany({
        where: { leadId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.leadActivity.count({ where: { leadId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error(`Get lead activities failed: ${leadId}`, error);
    throw error;
  }
};

// Add lead activity
export const addLeadActivity = async (leadId: string, activityData: ActivityData) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId,
        ...activityData,
      },
    });

    // Update lead's last contact time
    await prisma.lead.update({
      where: { id: leadId },
      data: { lastContactAt: new Date() },
    });

    logger.info(`Lead activity added: ${leadId} - ${activityData.type}`);
    return activity;
  } catch (error) {
    logger.error(`Add lead activity failed: ${leadId}`, error);
    throw error;
  }
};

// Get leads by stage
export const getLeadsByStage = async (stage: LeadStage, page: number, limit: number, filters: { assignedTo?: string }) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = { stage };
    
    if (filters.assignedTo) {
      where.assignedToId = filters.assignedTo;
    }

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
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error(`Get leads by stage failed: ${stage}`, error);
    throw error;
  }
};

// Get lead funnel statistics
export const getLeadFunnelStats = async (filters: FunnelStatsFilters) => {
  try {
    const where: any = {};
    
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }
    
    if (filters.assignedTo) {
      where.assignedToId = filters.assignedTo;
    }

    const stageStats = await prisma.lead.groupBy({
      by: ['stage'],
      where,
      _count: true,
    });

    const totalLeads = stageStats.reduce((sum, stat) => sum + stat._count, 0);

    const funnelData = stageStats.map(stat => ({
      stage: stat.stage,
      count: stat._count,
      percentage: totalLeads > 0 ? (stat._count / totalLeads) * 100 : 0,
    }));

    return {
      totalLeads,
      funnelData,
      conversionRate: totalLeads > 0 ? 
        ((stageStats.find(s => s.stage === 'CLOSED_WON')?._count || 0) / totalLeads) * 100 : 0,
    };
  } catch (error) {
    logger.error('Get lead funnel stats failed', error);
    throw error;
  }
};

// Get lead performance statistics
export const getLeadPerformanceStats = async (filters: PerformanceStatsFilters) => {
  try {
    const dateFilter = getDateFilterForPeriod(filters.period);
    const where: any = { createdAt: dateFilter };
    
    if (filters.assignedTo) {
      where.assignedToId = filters.assignedTo;
    }

    const [
      totalLeads,
      convertedLeads,
      avgDealValue,
      avgConversionTime,
    ] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: 'CONVERTED' } }),
      prisma.lead.aggregate({
        where: { ...where, status: 'CONVERTED' },
        _avg: { value: true },
      }),
      prisma.lead.findMany({
        where: { ...where, status: 'CONVERTED' },
        select: { createdAt: true, convertedAt: true },
      }),
    ]);

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    const avgConversionDays = avgConversionTime.length > 0 ?
      avgConversionTime.reduce((sum, lead) => {
        if (lead.convertedAt) {
          const days = Math.ceil((lead.convertedAt.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }
        return sum;
      }, 0) / avgConversionTime.length : 0;

    return {
      totalLeads,
      convertedLeads,
      conversionRate,
      avgDealValue: avgDealValue._avg.value || 0,
      avgConversionDays,
    };
  } catch (error) {
    logger.error('Get lead performance stats failed', error);
    throw error;
  }
};

// Bulk assign leads
export const bulkAssignLeads = async (leadIds: string[], assignedToId: string, options: BulkAssignOptions) => {
  try {
    const salesPerson = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!salesPerson) {
      throw new NotFoundError('Sales person not found');
    }

    const updatedLeads = await prisma.lead.updateMany({
      where: { id: { in: leadIds } },
      data: {
        assignedToId,
        updatedAt: new Date(),
      },
    });

    // Add activity records for each lead
    const activities = leadIds.map(leadId => ({
      leadId,
      type: ActivityType.ASSIGNMENT,
      description: `Lead bulk assigned to ${salesPerson.name}`,
      notes: options.notes,
      performedBy: options.assignedBy,
    }));

    await prisma.leadActivity.createMany({
      data: activities,
    });

    logger.info(`Bulk assigned ${leadIds.length} leads to ${salesPerson.name}`);
    return { assignedCount: updatedLeads.count };
  } catch (error) {
    logger.error('Bulk assign leads failed', error);
    throw error;
  }
};

// Get my assigned leads (for sales users)
export const getMyAssignedLeads = async (userId: string, page: number, limit: number, filters: MyLeadsFilters) => {
  try {
    const skip = (page - 1) * limit;
    
    const where: any = { assignedToId: userId };
    
    if (filters.stage) {
      where.stage = filters.stage;
    }
    
    if (filters.priority) {
      where.priority = filters.priority;
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        include: {
          college: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { nextFollowUp: 'asc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.lead.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    logger.error(`Get my assigned leads failed: ${userId}`, error);
    throw error;
  }
};

// Helper function to get valid stage transitions
function getValidStageTransitions(currentStage: string): string[] {
  const transitions: { [key: string]: string[] } = {
    'LEAD_GENERATED': ['CONTACTED', 'DENIED'],
    'CONTACTED': ['DEMO_GIVEN', 'DENIED'],
    'DEMO_GIVEN': ['TRAINING_BOOKED', 'DENIED'],
    'TRAINING_BOOKED': ['IN_PROGRESS', 'DENIED'],
    'IN_PROGRESS': ['CLOSED_WON', 'DENIED'],
    'CLOSED_WON': ['FEEDBACK_COLLECTED'],
    'FEEDBACK_COLLECTED': [],
    'DENIED': ['LEAD_GENERATED'], // For recycling
  };

  return transitions[currentStage] || [];
}

// Helper function to get date filter for period
function getDateFilterForPeriod(period: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case 'today':
      return { gte: startOfDay };
    case 'week':
      const weekAgo = new Date(startOfDay);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return { gte: weekAgo };
    case 'month':
      const monthAgo = new Date(startOfDay);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return { gte: monthAgo };
    case 'quarter':
      const quarterAgo = new Date(startOfDay);
      quarterAgo.setMonth(quarterAgo.getMonth() - 3);
      return { gte: quarterAgo };
    case 'year':
      const yearAgo = new Date(startOfDay);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      return { gte: yearAgo };
    default:
      const defaultMonthAgo = new Date(startOfDay);
      defaultMonthAgo.setMonth(defaultMonthAgo.getMonth() - 1);
      return { gte: defaultMonthAgo };
  }
}