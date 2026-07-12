import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class DashboardController {
  /**
   * Get operational KPIs
   */
  public static getDashboardKpis = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const kpis = await DashboardService.getDashboardKpis();
    return res.status(200).json(
      new ApiResponse('Dashboard KPIs retrieved successfully', kpis)
    );
  });
}
