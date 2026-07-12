import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class AnalyticsController {
  public static getOverview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to } = req.query as any;
    const data = await AnalyticsService.getOverviewAnalytics(from, to);
    return res.status(200).json(new ApiResponse('Analytics overview retrieved successfully', data));
  });

  public static getTripAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to } = req.query as any;
    const data = await AnalyticsService.getTripAnalytics(from, to);
    return res.status(200).json(new ApiResponse('Trip analytics retrieved successfully', data));
  });

  public static getFuelAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to } = req.query as any;
    const data = await AnalyticsService.getFuelAnalytics(from, to);
    return res.status(200).json(new ApiResponse('Fuel analytics retrieved successfully', data));
  });

  public static getExpenseAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to } = req.query as any;
    const data = await AnalyticsService.getExpenseAnalytics(from, to);
    return res.status(200).json(new ApiResponse('Expense analytics retrieved successfully', data));
  });
}
