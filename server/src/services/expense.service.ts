import { prisma } from '../config/prisma';
import { ApiError } from '../utils/api-error';

export class ExpenseService {
  /**
   * List expenses with optional query filtering
   */
  public static async getExpenses(filters?: {
    vehicleId?: number;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const whereClause: any = {};

    if (filters?.vehicleId) whereClause.vehicleId = filters.vehicleId;
    if (filters?.category) {
      whereClause.category = {
        equals: filters.category,
        mode: 'insensitive',
      };
    }
    
    if (filters?.startDate || filters?.endDate) {
      whereClause.date = {};
      if (filters.startDate) whereClause.date.gte = filters.startDate;
      if (filters.endDate) whereClause.date.lte = filters.endDate;
    }

    return prisma.expense.findMany({
      where: whereClause,
      include: {
        vehicle: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Find a single expense by ID
   */
  public static async getExpenseById(id: number) {
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!expense) {
      throw new ApiError(404, 'Expense not found');
    }

    return expense;
  }

  /**
   * Create a new expense
   */
  public static async createExpense(data: {
    vehicleId: number;
    category: string;
    amount: number;
    description: string;
    date: Date;
  }) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    return prisma.expense.create({
      data,
      include: {
        vehicle: true,
      },
    });
  }

  /**
   * Update an existing expense
   */
  public static async updateExpense(
    id: number,
    data: {
      vehicleId?: number;
      category?: string;
      amount?: number;
      description?: string;
      date?: Date;
    }
  ) {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new ApiError(404, 'Expense not found');
    }

    if (data.vehicleId && data.vehicleId !== expense.vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: data.vehicleId },
      });

      if (!vehicle) {
        throw new ApiError(404, 'Vehicle not found');
      }
    }

    return prisma.expense.update({
      where: { id },
      data,
      include: {
        vehicle: true,
      },
    });
  }

  /**
   * Delete an expense
   */
  public static async deleteExpense(id: number) {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new ApiError(404, 'Expense not found');
    }

    return prisma.expense.delete({
      where: { id },
    });
  }
}
