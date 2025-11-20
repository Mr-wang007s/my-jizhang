// Core entities
export interface Transaction {
  _id: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  note?: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
  order: number;
  createdAt: string;
}

// Input DTOs
export interface CreateTransactionInput {
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  date: string;
  note?: string;
}

export interface UpdateTransactionInput {
  amount?: number;
  type?: 'income' | 'expense';
  categoryId?: string;
  date?: string;
  note?: string;
}

export interface CreateCategoryInput {
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense' | 'both';
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
  order?: number;
}

// Computed/Derived types
export interface MonthlyBalance {
  income: number;
  expense: number;
  balance: number;
  month: string; // YYYY-MM format
}

export interface CategoryBreakdown {
  period: {
    start: string;
    end: string;
  };
  type: 'income' | 'expense';
  data: Array<{
    categoryId: string;
    categoryName: string;
    total: number;
    percentage: number;
    transactionCount: number;
  }>;
  grandTotal: number;
}

export interface TimeSeries {
  period: {
    start: string;
    end: string;
  };
  granularity: 'day' | 'week' | 'month' | 'year';
  data: Array<{
    period: string;
    income: number;
    expense: number;
    balance: number;
  }>;
}

// Service error types
export class ServiceError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string, details?: any) {
    super(message, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

// List/Pagination types
export interface ListTransactionsOptions {
  type?: 'income' | 'expense';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: 'date' | 'amount' | 'createdAt';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  hasMore: boolean;
}
