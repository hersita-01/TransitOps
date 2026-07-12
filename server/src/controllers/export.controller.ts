import { Request, Response, NextFunction } from 'express';
import { ExportService } from '../services/export.service';
import { asyncHandler } from '../utils/async-handler';

export class ExportController {
  private static sendCsv(res: Response, filename: string, csvData: string) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvData);
  }

  public static exportTrips = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to } = req.query as any;
    const csv = await ExportService.exportTrips(from, to);
    ExportController.sendCsv(res, 'trips.csv', csv);
  });

  public static exportFuelLogs = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to } = req.query as any;
    const csv = await ExportService.exportFuelLogs(from, to);
    ExportController.sendCsv(res, 'fuel.csv', csv);
  });

  public static exportExpenses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { from, to } = req.query as any;
    const csv = await ExportService.exportExpenses(from, to);
    ExportController.sendCsv(res, 'expenses.csv', csv);
  });
}
