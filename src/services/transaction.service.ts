/**
 * Transaction Service - CRUD operations for transactions
 */

import {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsOptions,
  TransactionListResponse,
  ValidationError,
  NotFoundError
} from '../types'
import { storageAdapter } from './storage.adapter'
import { validateTransaction } from '../utils/validation'
import { getMonthRange } from '../utils/date'

export class TransactionService {
  /**
   * Create a new transaction
   */
  static async create(input: CreateTransactionInput): Promise<Transaction> {
    // Validate input
    const validation = validateTransaction(input)
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '))
    }

    // Create transaction with timestamps
    const transaction = {
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const created = await storageAdapter.create<Transaction>('transactions', transaction)
    return created
  }

  /**
   * Update an existing transaction
   */
  static async update(id: string, updates: UpdateTransactionInput): Promise<Transaction> {
    // Validate updates
    if (updates.amount !== undefined || updates.type !== undefined || 
        updates.categoryId !== undefined || updates.date !== undefined) {
      const current = await this.getById(id)
      if (!current) {
        throw new NotFoundError(`Transaction with id ${id} not found`)
      }

      const merged = { ...current, ...updates }
      const validation = validateTransaction(merged)
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '))
      }
    }

    // Update with new timestamp
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    const updated = await storageAdapter.update<Transaction>('transactions', id, updatedData)
    return updated
  }

  /**
   * Delete a transaction
   */
  static async delete(id: string): Promise<void> {
    await storageAdapter.delete('transactions', id)
  }

  /**
   * Get transaction by ID
   */
  static async getById(id: string): Promise<Transaction | null> {
    return await storageAdapter.getById<Transaction>('transactions', id)
  }

  /**
   * List transactions with filtering, sorting, and pagination
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
      offset = 0
    } = options

    // Build query
    const query: any = {}
    if (type) query.type = type
    if (categoryId) query.categoryId = categoryId
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate }
    }

    // Get all matching transactions (for local storage, this is the easiest approach)
    let transactions = await storageAdapter.get<Transaction>('transactions', query)

    // Sort
    transactions.sort((a, b) => {
      const aVal = a[orderBy as keyof Transaction]
      const bVal = b[orderBy as keyof Transaction]
      
      if (order === 'desc') {
        return aVal < bVal ? 1 : -1
      } else {
        return aVal > bVal ? 1 : -1
      }
    })

    // Get total count
    const total = transactions.length

    // Apply pagination
    const paginatedData = transactions.slice(offset, offset + limit)

    return {
      data: paginatedData,
      total,
      hasMore: offset + limit < total
    }
  }

  /**
   * Get all transactions for a specific month
   */
  static async getMonthlyTransactions(year: number, month: number): Promise<Transaction[]> {
    const { start, end } = getMonthRange(year, month)
    
    const result = await this.list({
      startDate: start,
      endDate: end,
      limit: 1000 // Get all for the month
    })

    return result.data
  }
}
