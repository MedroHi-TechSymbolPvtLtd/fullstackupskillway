import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { LeadStage } from '@prisma/client';

/**
 * Dashboard service
 * Provides statistics and data for dashboard views
 */

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const [
      totalLeads,
      totalColleges,
      totalTrainers,
      totalUsers,
      convertedLeads,
      activeTrainings,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.college.count(),
      prisma.trainer.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
      prisma.training.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.college.aggregate({
        _sum: { totalRevenue: true },
      }),
    ]);

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      totalColleges,
      totalTrainers,
      totalUsers,
      recentLeads: await prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
      conversionRate: Math.round(conversionRate * 100) / 100,
      activeTrainings,
      monthlyRevenue: monthlyRevenue._sum.totalRevenue || 0,
    };
  } catch (error) {
    logger.error('Get dashboard stats failed', error);
    throw error;
  }
};

// Get recent activities (lead activities, status changes, etc.)
export const getRecentActivities = async (limit: number = 10) => {
  try {
    const activities = await prisma.leadActivity.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            organization: true,
            stage: true,
            status: true,
          },
        },
      },
    });

    return activities;
  } catch (error) {
    logger.error('Get recent activities failed', error);
    throw error;
  }
};

// Get lead funnel data by stages
export const getLeadFunnelData = async () => {
  try {
    const stageStats = await prisma.lead.groupBy({
      by: ['stage'],
      _count: true,
      orderBy: { _count: { stage: 'desc' } },
    });

    const totalLeads = stageStats.reduce((sum, stat) => sum + stat._count, 0);

    const funnelData = stageStats.map(stat => ({
      stage: stat.stage,
      count: stat._count,
      percentage: totalLeads > 0 ? Math.round((stat._count / totalLeads) * 100 * 100) / 100 : 0,
    }));

    return {
      totalLeads,
      funnelData,
      conversionRate: totalLeads > 0 ? 
        Math.round(((stageStats.find(s => s.stage === 'CONVERTED')?._count || 0) / totalLeads) * 100 * 100) / 100 : 0,
    };
  } catch (error) {
    logger.error('Get lead funnel data failed', error);
    throw error;
  }
};

// Get monthly trends
export const getMonthlyTrends = async (months: number = 6) => {
  try {
    const trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const [leads, converted, colleges] = await Promise.all([
        prisma.lead.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        prisma.lead.count({
          where: {
            convertedAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        prisma.college.count({
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
      ]);

      trends.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        leads,
        converted,
        colleges,
        conversionRate: leads > 0 ? Math.round((converted / leads) * 100 * 100) / 100 : 0,
      });
    }

    return trends;
  } catch (error) {
    logger.error('Get monthly trends failed', error);
    throw error;
  }
};

// Get performance metrics
export const getPerformanceMetrics = async () => {
  try {
    const [
      totalRevenue,
      convertedLeads,
      totalLeads,
      avgDealValue,
    ] = await Promise.all([
      prisma.college.aggregate({
        _sum: { totalRevenue: true },
      }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
      prisma.lead.count(),
      prisma.lead.aggregate({
        where: { status: 'CONVERTED' },
        _avg: { value: true },
      }),
    ]);

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    return {
      totalRevenue: totalRevenue._sum.totalRevenue || 0,
      avgDealSize: avgDealValue._avg.value || 0,
      conversionRate: Math.round(conversionRate * 100) / 100,
      avgResponseTime: 0, // Can be calculated from lead activities if needed
    };
  } catch (error) {
    logger.error('Get performance metrics failed', error);
    throw error;
  }
};

// Get leads by specific stages for dashboard tracking
export const getLeadsByDashboardStages = async () => {
  try {
    const dashboardStages: LeadStage[] = [
      'START',
      'IN_CONVERSATION',
      'EMAIL_WHATSAPP',
      'IN_PROGRESS',
      'CONVERT',
      'DENIED',
    ];

    const stageData = await Promise.all(
      dashboardStages.map(async (stage) => {
        const [leads, count] = await Promise.all([
          prisma.lead.findMany({
            where: { stage },
            take: 10, // Get latest 10 for preview
            orderBy: { updatedAt: 'desc' },
            select: {
              id: true,
              name: true,
              email: true,
              organization: true,
              stage: true,
              status: true,
              priority: true,
              updatedAt: true,
              assignedTo: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          }),
          prisma.lead.count({ where: { stage } }),
        ]);

        return {
          stage,
          count,
          leads,
        };
      })
    );

    return stageData;
  } catch (error) {
    logger.error('Get leads by dashboard stages failed', error);
    throw error;
  }
};

// Get converted leads that should be in college table
export const getConvertedLeadsWithColleges = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: {
          stage: 'CONVERTED',
          status: 'CONVERTED',
        },
        skip,
        take: limit,
        include: {
          college: {
            select: {
              id: true,
              name: true,
              status: true,
              city: true,
              state: true,
              contactEmail: true,
              contactPhone: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { convertedAt: 'desc' },
      }),
      prisma.lead.count({
        where: {
          stage: 'CONVERTED',
          status: 'CONVERTED',
        },
      }),
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
    logger.error('Get converted leads with colleges failed', error);
    throw error;
  }
};