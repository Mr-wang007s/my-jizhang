import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsOptions,
  TransactionListResponse,
} from '../types';
import { ValidationError, NotFoundError } from '../types';
import {
  validateAmount,
  validateDate,
  validateCategoryId,
  validateNote,
  validateType,
} from '../utils/validation';
import { getTimestamp, formatDate } from '../utils/date';
import { roundCurrency } from '../utils/currency';
import { getStorageAdapter } from './storage.adapter';

const COLLECTION = 'transactions';
const storage = getStorageAdapter();

export class TransactionService {
  /**
   * Create a new transaction
   */
  static async create(input: CreateTransactionInput): Promise<Transaction> {
    // Validate all fields
    this.validateInput(input);

    // Round amount to 2 decimal places
    const amount = roundCurrency(input.amount);

    const transaction = await storage.create<Transaction>(COLLECTION, {
      amount,
      type: input.type,
      categoryId: input.categoryId,
      date: formatDate(input.date),
      note: input.note,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    });

    return transaction;
  }

  /**
   * List transactions with filters, sorting, and pagination
   */
  static async list(options: ListTransactionsOptions = {}): Promise<TransactionListResponse> {
    const {
      type,
      categoryId,
      startDate,
      endDate,
      orderBy = 'date',
      order = 'desc',
      limit = 20,
      offset = 0,
    } = options;

    // Get all transactions (in real app, would query with filters)
    let transactions = await storage.get<Transaction>(COLLECTION);

    // Apply filters
    if (type) {
      transactions = transactions.filter((t) => t.type === type);
    }

    if (categoryId) {
      transactions = transactions.filter((t) => t.categoryId === categoryId);
    }

    if (startDate) {
      transactions = transactions.filter((t) => t.date >= startDate);
    }

    if (endDate) {
      transactions = transactions.filter((t) => t.date <= endDate);
    }

    // Sort
    transactions.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (orderBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'date':
        default:
          aValue = a.date;
          bValue = b.date;
          break;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const total = transactions.length;
    const data = transactions.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return { data, total, hasMore };
  }

  /**
   * Get transaction by ID
   */
  static async getById(id: string): Promise<Transaction | null> {
    return await storage.getById<Transaction>(COLLECTION, id);
  }

  /**
   * Update transaction
   */
  static async update(
    id: string,
    updates: UpdateTransactionInput
  ): Promise<Transaction> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError('交易记录不存在');
    }

    // Validate updates
    if (updates.amount !== undefined) {
      const validation = validateAmount(updates.amount);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
      updates.amount = roundCurrency(updates.amount);
    }

    if (updates.date) {
      const validation = validateDate(updates.date);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
      updates.date = formatDate(updates.date);
    }

    if (updates.categoryId) {
      const validation = validateCategoryId(updates.categoryId);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }

    if (updates.type) {
      const validation = validateType(updates.type);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }

    if (updates.note !== undefined) {
      const validation = validateNote(updates.note);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }

    const updated = await storage.update<Transaction>(COLLECTION, id, {
      ...updates,
      updatedAt: getTimestamp(),
    });

    return updated;
  }

  /**
   * Delete transaction
   */
  static async delete(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError('交易记录不存在');
    }

    await storage.delete(COLLECTION, id);
  }

  /**
   * Get transactions for a specific month
   */
  static async getMonthlyTransactions(year: number, month: number): Promise<Transaction[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

    const result = await this.list({ startDate, endDate, limit: 10000 });
    return result.data;
  }

  /**
   * Validate transaction input
   */
  private static validateInput(input: CreateTransactionInput | UpdateTransactionInput): void {
    if ('amount' in input && input.amount !== undefined) {
      const validation = validateAmount(input.amount);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }

    if ('type' in input && input.type) {
      const validation = validateType(input.type);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }

    if ('date' in input && input.date) {
      const validation = validateDate(input.date);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }

    if ('categoryId' in input && input.categoryId) {
      const validation = validateCategoryId(input.categoryId);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }

    if ('note' in input) {
      const validation = validateNote(input.note);
      if (!validation.valid) {
        throw new ValidationError(validation.error!);
      }
    }
  }
}
