import { idxGenerator } from '@/utils/idx.utils';
import database from '..';
import { DB_COLLECTION } from '../collection';
import Expenses from '../model/expenses.model';
import { responseHandler } from '../util/response-handler';
import Income from '../model/income.model';

export const financeService = {
  createExpenses: async (data: Partial<Expenses> & { shopId: string }) => {
    console.log('data', data, 'shopId', data.shopId);
    if (!data.amount || !data.title || !data.shopId) {
      return responseHandler({
        data: null,
        success: false,
        message: 'Missing required fields',
        statusCode: 400,
      });
    }

    try {
      const id = idxGenerator();
      let createdExpense = null;

      await database.write(async () => {
        createdExpense = await DB_COLLECTION.expenses.create((expense) => {
          expense._raw.id = id;
          expense.amount = data.amount!;
          expense.title = data.title!;
          expense.remarks = data.remarks || '';
          expense.shopId = data.shopId;
          expense.created_at = data.created_at || Date.now();
          expense.updated_at = Date.now();
        });
      });

      return responseHandler({
        data: createdExpense,
        success: true,
        message: 'Expense created successfully',
        statusCode: 201,
      });
    } catch (error) {
      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },

  getSingleExpenses: async (id: string) => {
    try {
      const expense = await DB_COLLECTION.expenses.find(id);
      return responseHandler({
        data: expense,
        success: true,
        message: 'Expense fetched successfully',
        statusCode: 200,
      });
    } catch (error: any) {
      if (typeof error?.message === 'string' && error.message.toLowerCase().includes('not found')) {
        return responseHandler({
          data: null,
          success: false,
          message: 'Expense not found',
          statusCode: 404,
        });
      }
      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },
  updateExpenses: async (id: string, data: Partial<Expenses>) => {
    try {
      if (!id || data.amount === undefined || data.title === undefined) {
        return responseHandler({
          data: null,
          success: false,
          message: 'Missing required fields',
          statusCode: 400,
        });
      }

      let updatedExpense: any = null;

      await database.write(async () => {
        const expense = await DB_COLLECTION.expenses.find(id);
        if (!expense) {
          return responseHandler({
            data: null,
            success: false,
            message: 'Expense not found',
            statusCode: 404,
          });
        }
        await expense.update((e) => {
          if (data.amount !== undefined) e.amount = data.amount!;
          if (data.title !== undefined) e.title = data.title!;
          if (data.remarks !== undefined) e.remarks = data.remarks!;
          if (data.created_at !== undefined) e.created_at = data.created_at!;
          e.updated_at = Date.now();
        });
        updatedExpense = expense;
      });

      return responseHandler({
        data: updatedExpense,
        success: true,
        message: 'Expense updated successfully',
        statusCode: 200,
      });
    } catch (error: any) {
      if (typeof error?.message === 'string' && error.message.toLowerCase().includes('not found')) {
        return responseHandler({
          data: null,
          success: false,
          message: 'Expense not found',
          statusCode: 404,
        });
      }

      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },
  deleteExpenses: async (id: string) => {
    try {
      await database.write(async () => {
        const expense = await DB_COLLECTION.expenses.find(id);
        if (!expense) {
          return responseHandler({
            data: null,
            success: false,
            message: 'Expense not found',
            statusCode: 404,
          });
        }
        await expense.markAsDeleted();
      });
      return responseHandler({
        data: null,
        success: true,
        message: 'Expense deleted successfully',
        statusCode: 200,
      });
    } catch (error) {
      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },

  createIncome: async (data: Partial<Income> & { shopId: string }) => {
    console.log('data', data, 'shopId', data.shopId);
    if (!data.amount || !data.incomeSource || !data.shopId) {
      return responseHandler({
        data: null,
        success: false,
        message: 'Missing required fields',
        statusCode: 400,
      });
    }

    try {
      const id = idxGenerator();
      let createdIncome = null;

      await database.write(async () => {
        createdIncome = await DB_COLLECTION.income.create((income) => {
          income._raw.id = id;
          income.amount = data.amount!;
          income.incomeSource = data.incomeSource!;
          income.remarks = data.remarks || '';
          income.shopId = data.shopId;
          income.created_at = data.created_at;
          income.updated_at = data.created_at;
        });
      });

      return responseHandler({
        data: createdIncome,
        success: true,
        message: 'Income created successfully',
        statusCode: 201,
      });
    } catch (error) {
      console.log('error', error);
      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },
  updateIncome: async (id: string, data: Partial<Income>) => {
    try {
      if (!id || data.amount === undefined || data.incomeSource === undefined) {
        return responseHandler({
          data: null,
          success: false,
          message: 'Missing required fields',
          statusCode: 400,
        });
      }

      let updatedIncome: any = null;

      await database.write(async () => {
        const income = await DB_COLLECTION.income.find(id);
        if (!income) {
          return responseHandler({
            data: null,
            success: false,
            message: 'Income not found',
            statusCode: 404,
          });
        }
        await income.update((i) => {
          if (data.amount !== undefined) i.amount = data.amount!;
          if (data.incomeSource !== undefined) i.incomeSource = data.incomeSource!;
          if (data.remarks !== undefined) i.remarks = data.remarks!;
          if (data.created_at !== undefined) i.created_at = data.created_at!;
          i.updated_at = Date.now();
        });
        updatedIncome = income;
      });

      return responseHandler({
        data: updatedIncome,
        success: true,
        message: 'Saving updated successfully',
        statusCode: 200,
      });
    } catch (error) {
      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },
  deleteIncome: async (id: string) => {
    try {
      await database.write(async () => {
        const income = await DB_COLLECTION.income.find(id);
        if (!income) {
          return responseHandler({
            data: null,
            success: false,
            message: 'Income not found',
            statusCode: 404,
          });
        }
        await income.markAsDeleted();
      });
      return responseHandler({
        data: null,
        success: true,
        message: 'Income deleted successfully',
        statusCode: 200,
      });
    } catch (error) {
      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },
  getSingleIncome: async (id: string) => {
    try {
      const income = await DB_COLLECTION.income.find(id);
      if (!income) {
        return responseHandler({
          data: null,
          success: false,
          message: 'Income not found',
          statusCode: 404,
        });
      }
      return responseHandler({
        data: income,
        success: true,
        message: 'Income fetched successfully',
        statusCode: 200,
      });
    } catch (error) {
      return responseHandler({
        data: null,
        success: false,
        message: 'Something went wrong',
        statusCode: 500,
      });
    }
  },
};
