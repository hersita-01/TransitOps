import { prisma } from '../config/prisma';

export class ExportService {
  /**
   * Safely serializes data to a CSV string, preventing formula injection
   */
  private static serializeToCsv(headers: string[], rows: any[][]): string {
    const sanitizeCell = (cell: any): string => {
      if (cell === null || cell === undefined) return '';
      
      let str = String(cell);
      
      // Prevent formula injection
      if (/^[=+\-@]/.test(str)) {
        str = "'" + str;
      }

      // Escape quotes and wrap in quotes if necessary
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      
      return str;
    };

    const headerRow = headers.map(sanitizeCell).join(',');
    const dataRows = rows.map(row => row.map(sanitizeCell).join(','));

    return [headerRow, ...dataRows].join('\n');
  }

  /**
   * Helper to build date range filters
   */
  private static getDateFilter(field: string, from?: Date, to?: Date) {
    if (!from && !to) return undefined;
    const filter: any = {};
    if (from) filter.gte = from;
    if (to) filter.lte = to;
    return { [field]: filter };
  }

  public static async exportTrips(from?: Date, to?: Date): Promise<string> {
    const where = this.getDateFilter('startTime', from, to);
    
    const trips = await prisma.trip.findMany({
      where,
      include: {
        vehicle: { select: { registrationNumber: true } },
        driver: { select: { name: true, licenseNumber: true } }
      },
      orderBy: { startTime: 'desc' }
    });

    const headers = [
      'Trip ID',
      'Vehicle Registration',
      'Driver Name',
      'Driver License',
      'Source',
      'Destination',
      'Cargo Weight',
      'Planned Distance',
      'Actual Distance',
      'Fuel Used',
      'Status',
      'Start Time',
      'End Time'
    ];

    const rows = trips.map(t => [
      t.id,
      t.vehicle.registrationNumber,
      t.driver.name,
      t.driver.licenseNumber,
      t.source,
      t.destination,
      t.cargoWeight,
      t.plannedDistance,
      t.actualDistance,
      t.fuelUsed,
      t.status,
      t.startTime.toISOString(),
      t.endTime ? t.endTime.toISOString() : ''
    ]);

    return this.serializeToCsv(headers, rows);
  }

  public static async exportFuelLogs(from?: Date, to?: Date): Promise<string> {
    const where = this.getDateFilter('date', from, to);
    
    const fuelLogs = await prisma.fuelLog.findMany({
      where,
      include: {
        vehicle: { select: { registrationNumber: true } }
      },
      orderBy: { date: 'desc' }
    });

    const headers = [
      'Fuel Log ID',
      'Vehicle Registration',
      'Liters',
      'Cost',
      'Date'
    ];

    const rows = fuelLogs.map(f => [
      f.id,
      f.vehicle.registrationNumber,
      f.liters,
      f.cost,
      f.date.toISOString()
    ]);

    return this.serializeToCsv(headers, rows);
  }

  public static async exportExpenses(from?: Date, to?: Date): Promise<string> {
    const where = this.getDateFilter('date', from, to);
    
    const expenses = await prisma.expense.findMany({
      where,
      include: {
        vehicle: { select: { registrationNumber: true } }
      },
      orderBy: { date: 'desc' }
    });

    const headers = [
      'Expense ID',
      'Vehicle Registration',
      'Category',
      'Amount',
      'Description',
      'Date'
    ];

    const rows = expenses.map(e => [
      e.id,
      e.vehicle.registrationNumber,
      e.category,
      e.amount,
      e.description,
      e.date.toISOString()
    ]);

    return this.serializeToCsv(headers, rows);
  }
}
