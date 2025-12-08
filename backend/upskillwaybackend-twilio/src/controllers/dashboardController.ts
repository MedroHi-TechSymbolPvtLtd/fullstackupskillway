import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendSuccess, sendPaginated } from '../utils/response';
import * as dashboardService from '../services/dashboardService';

export const getDashboardStatsController = asyncHandler(async (req: Request, res: Response) => {
  const stats = await dashboardService.getDashboardStats();
  sendSuccess(res, stats, 'Dashboard statistics retrieved successfully');
});

export const getRecentActivitiesController = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const activities = await dashboardService.getRecentActivities(limit);
  sendSuccess(res, activities, 'Recent activities retrieved successfully');
});

export const getLeadFunnelController = asyncHandler(async (req: Request, res: Response) => {
  const funnelData = await dashboardService.getLeadFunnelData();
  sendSuccess(res, funnelData, 'Lead funnel data retrieved successfully');
});

export const getMonthlyTrendsController = asyncHandler(async (req: Request, res: Response) => {
  const months = parseInt(req.query.months as string) || 6;
  const trends = await dashboardService.getMonthlyTrends(months);
  sendSuccess(res, trends, 'Monthly trends retrieved successfully');
});

export const getPerformanceMetricsController = asyncHandler(async (req: Request, res: Response) => {
  const metrics = await dashboardService.getPerformanceMetrics();
  sendSuccess(res, metrics, 'Performance metrics retrieved successfully');
});

// Get leads by dashboard stages (START, IN_CONVERSATION, EMAIL_WHATSAPP, IN_PROGRESS, CONVERT, DENIED)
export const getLeadsByDashboardStagesController = asyncHandler(async (req: Request, res: Response) => {
  const stageData = await dashboardService.getLeadsByDashboardStages();
  sendSuccess(res, stageData, 'Leads by dashboard stages retrieved successfully');
});

// Get converted leads with colleges
export const getConvertedLeadsWithCollegesController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await dashboardService.getConvertedLeadsWithColleges(page, limit);
  sendPaginated(res, result.leads, result.pagination, 'Converted leads with colleges retrieved successfully');
});