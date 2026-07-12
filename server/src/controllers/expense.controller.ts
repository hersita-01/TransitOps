import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expense.service';
import { ApiResponse } from '../utils/api-response';
import { asyncHandler } from '../utils/async-handler';

export class ExpenseController {
  /**
   * List all expenses with optional filters
   */
  public static getExpenses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;
    const expenses = await ExpenseService.getExpenses(filters as any);
    return res.status(200).json(
      new ApiResponse('Expenses retrieved successfully', expenses)
    );
  });

  /**
   * Get a single expense by ID
   */
  public static getExpenseById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const expense = await ExpenseService.getExpenseById(id);
    return res.status(200).json(
      new ApiResponse('Expense retrieved successfully', expense)
    );
  });

  /**
   * Create a new expense
   */
  public static createExpense = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const expense = await ExpenseService.createExpense(req.body);
    return res.status(201).json(
      new ApiResponse('Expense created successfully', expense)
    );
  });

  /**
   * Update an existing expense
   */
  public static updateExpense = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const expense = await ExpenseService.updateExpense(id, req.body);
    return res.status(200).json(
      new ApiResponse('Expense updated successfully', expense)
    );
  });

  /**
   * Delete an expense
   */
  public static deleteExpense = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    await ExpenseService.deleteExpense(id);
    return res.status(200).json(
      new ApiResponse('Expense deleted successfully', null)
    );
  });
}
