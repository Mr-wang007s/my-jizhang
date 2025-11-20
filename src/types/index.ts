// Transaction Types

export interface Transaction {
  _id: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  date: string  // ISO 8601 format (YYYY-MM-DD)
  note?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionInput {
  amount: number        // Positive number, max 2 decimal places
  type: 'income' | 'expense'
  categoryId: string    // Must reference existing category
  date: string          // ISO 8601 format (YYYY-MM-DD)
  note?: string         // Optional, max 200 chars
}

export interface UpdateTransactionInput {
  amount?: number
  type?: 'income' | 'expense'
  categoryId?: string
  date?: string
  note?: string
}

// Category Types

export interface Category {
  _id: string
  name: string
  icon?: string
  color?: string
  type: 'income' | 'expense' | 'both'
  isDefault: boolean
  order: number
  createdAt: string
}

export interface CreateCategoryInput {
  name: string          // Max 20 chars, unique
  icon?: string         // Emoji or icon name
  color?: string        // Hex color code
  type: 'income' | 'expense' | 'both'
}

export interface UpdateCategoryInput {
  name?: string
  icon?: string
  color?: string
  order?: number
}

// Balance Types (Computed/Derived)

export interface MonthlyBalance {
  income: number        // Total income for the month
  expense: number       // Total expense for the month
  balance: number       // income - expense
  month: string         // YYYY-MM format
}

// Trend Types (Computed/Derived)

export interface CategoryBreakdown {
  period: {
    start: string
    end: string
  }
  type: 'income' | 'expense'
  data: Array<{
    categoryId: string
    categoryName: string
    total: number
    percentage: number    // 0-100
    transactionCount: number
  }>
  grandTotal: number
}

export interface TimeSeries {
  period: {
    start: string
    end: string
  }
  granularity: 'day' | 'week' | 'month' | 'year'
  data: Array<{
    period: string      // Date label (e.g., '2025-11' for month)
    income: number
    expense: number
    balance: number     // income - expense for this period
  }>
}

export interface TopCategory {
  categoryId: string
  categoryName: string
  total: number
  transactionCount: number
}

// Service Input Types

export interface ListTransactionsOptions {
  // Filters
  type?: 'income' | 'expense'
  categoryId?: string
  startDate?: string      // ISO format
  endDate?: string        // ISO format
  
  // Sorting
  orderBy?: 'date' | 'amount' | 'createdAt'
  order?: 'asc' | 'desc'  // Default: 'desc'
  
  // Pagination
  limit?: number          // Default: 20, max: 100
  offset?: number         // Default: 0
}

export interface TransactionListResponse {
  data: Transaction[]
  total: number           // Total count (for pagination)
  hasMore: boolean        // True if more records exist
}

export interface CategoryBreakdownOptions {
  type: 'income' | 'expense'
  startDate: string     // ISO format
  endDate: string       // ISO format
}

export interface TimeSeriesOptions {
  startDate: string     // ISO format
  endDate: string       // ISO format
  granularity: 'day' | 'week' | 'month' | 'year'
}

export interface TopCategoriesOptions {
  type: 'income' | 'expense'
  startDate: string
  endDate: string
  limit: number         // Default: 5
}

// Error Types

export class ServiceError extends Error {
  code: string
  details?: any

  constructor(message: string, code: string, details?: any) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
    this.details = details
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'NOT_FOUND', details)
    this.name = 'NotFoundError'
  }
}

export class DuplicateError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'DUPLICATE', details)
    this.name = 'DuplicateError'
  }
}

export class PermissionError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'PERMISSION_DENIED', details)
    this.name = 'PermissionError'
  }
}

export class StorageError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'STORAGE_ERROR', details)
    this.name = 'StorageError'
  }
}
