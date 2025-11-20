# API Contracts: Personal Accounting System

**Feature**: 001-personal-accounting  
**Date**: 2025-11-20  
**Purpose**: Define data service interfaces for transactions, categories, and derived data

## Overview

This document defines the TypeScript interfaces and service contracts for data operations in the personal accounting system. These contracts abstract the underlying storage mechanism (WeChat Cloud DB or local storage).

---

## Service Interfaces

### TransactionService

**Purpose**: CRUD operations for financial transactions

#### Methods

##### `create(transaction: CreateTransactionInput): Promise<Transaction>`

Create a new transaction.

**Input**:
```typescript
interface CreateTransactionInput {
  amount: number        // Positive number, max 2 decimals
  type: 'income' | 'expense'
  categoryId: string    // Must reference existing category
  date: string          // ISO 8601 format (YYYY-MM-DD)
  note?: string         // Optional, max 200 chars
}
```

**Output**:
```typescript
interface Transaction {
  _id: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  date: string
  note?: string
  createdAt: string
  updatedAt: string
}
```

**Validation**:
- `amount > 0` and has max 2 decimal places
- `categoryId` exists in Categories
- `date` is valid ISO format, not > 7 days in future
- `note` length <= 200 characters

**Errors**:
- `InvalidAmountError`: Amount is negative or has >2 decimal places
- `CategoryNotFoundError`: categoryId doesn't exist
- `InvalidDateError`: Date format invalid or out of allowed range

**Example**:
```typescript
const transaction = await TransactionService.create({
  amount: 50.00,
  type: 'expense',
  categoryId: 'cat_food',
  date: '2025-11-20',
  note: '午餐'
})
```

---

##### `update(id: string, updates: UpdateTransactionInput): Promise<Transaction>`

Update an existing transaction.

**Input**:
```typescript
interface UpdateTransactionInput {
  amount?: number
  type?: 'income' | 'expense'
  categoryId?: string
  date?: string
  note?: string
}
```

**Output**: Updated `Transaction` object

**Validation**: Same as `create()` for provided fields

**Errors**:
- `TransactionNotFoundError`: id doesn't exist
- Same validation errors as `create()`

**Example**:
```typescript
const updated = await TransactionService.update('txn_123', {
  amount: 60.00,
  note: '午餐 + 咖啡'
})
```

---

##### `delete(id: string): Promise<void>`

Delete a transaction.

**Input**: Transaction ID (string)

**Output**: void (success) or throws error

**Errors**:
- `TransactionNotFoundError`: id doesn't exist

**Example**:
```typescript
await TransactionService.delete('txn_123')
```

---

##### `getById(id: string): Promise<Transaction | null>`

Retrieve a single transaction by ID.

**Input**: Transaction ID (string)

**Output**: `Transaction` or `null` if not found

**Example**:
```typescript
const transaction = await TransactionService.getById('txn_123')
```

---

##### `list(options: ListTransactionsOptions): Promise<TransactionListResponse>`

Retrieve transactions with filtering, sorting, and pagination.

**Input**:
```typescript
interface ListTransactionsOptions {
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
```

**Output**:
```typescript
interface TransactionListResponse {
  data: Transaction[]
  total: number           // Total count (for pagination)
  hasMore: boolean        // True if more records exist
}
```

**Example**:
```typescript
// Get recent expense transactions for food category
const result = await TransactionService.list({
  type: 'expense',
  categoryId: 'cat_food',
  startDate: '2025-11-01',
  endDate: '2025-11-30',
  orderBy: 'date',
  order: 'desc',
  limit: 20
})
```

---

##### `getMonthlyTransactions(year: number, month: number): Promise<Transaction[]>`

Get all transactions for a specific month.

**Input**: year (e.g., 2025), month (1-12)

**Output**: Array of `Transaction` objects

**Example**:
```typescript
const novemberTransactions = await TransactionService.getMonthlyTransactions(2025, 11)
```

---

### CategoryService

**Purpose**: Manage transaction categories

#### Methods

##### `create(category: CreateCategoryInput): Promise<Category>`

Create a new user-defined category.

**Input**:
```typescript
interface CreateCategoryInput {
  name: string          // Max 20 chars, unique
  icon?: string         // Emoji or icon name
  color?: string        // Hex color code
  type: 'income' | 'expense' | 'both'
}
```

**Output**:
```typescript
interface Category {
  _id: string
  name: string
  icon?: string
  color?: string
  type: 'income' | 'expense' | 'both'
  isDefault: boolean
  order: number
  createdAt: string
}
```

**Validation**:
- `name` is unique, max 20 characters
- `color` is valid hex code if provided (e.g., #FF5733)

**Errors**:
- `DuplicateCategoryNameError`: Name already exists
- `InvalidColorError`: Color is not valid hex format

**Example**:
```typescript
const category = await CategoryService.create({
  name: '宠物',
  icon: '🐾',
  color: '#FF6B6B',
  type: 'expense'
})
```

---

##### `update(id: string, updates: UpdateCategoryInput): Promise<Category>`

Update category details.

**Input**:
```typescript
interface UpdateCategoryInput {
  name?: string
  icon?: string
  color?: string
  order?: number
}
```

**Note**: `type` and `isDefault` are immutable

**Output**: Updated `Category` object

**Errors**:
- `CategoryNotFoundError`: id doesn't exist
- `DuplicateCategoryNameError`: New name conflicts with existing
- `CannotModifyDefaultError`: Attempting to change immutable fields

**Example**:
```typescript
const updated = await CategoryService.update('cat_custom_1', {
  name: '宠物护理',
  icon: '🏥'
})
```

---

##### `delete(id: string, reassignToCategoryId: string): Promise<void>`

Delete a category and reassign its transactions.

**Input**:
- `id`: Category to delete
- `reassignToCategoryId`: Target category for existing transactions

**Validation**:
- Cannot delete default categories (isDefault = true)
- `reassignToCategoryId` must exist

**Errors**:
- `CannotDeleteDefaultCategoryError`: Attempting to delete system category
- `CategoryNotFoundError`: id or reassignToCategoryId doesn't exist
- `CategoryHasTransactionsError`: Transactions exist but no reassign target provided

**Example**:
```typescript
// Delete custom category and move transactions to "其他"
await CategoryService.delete('cat_custom_1', 'cat_other')
```

---

##### `list(type?: 'income' | 'expense' | 'both'): Promise<Category[]>`

Get all categories, optionally filtered by type.

**Input**: Optional type filter

**Output**: Array of `Category` objects, sorted by `order` field

**Example**:
```typescript
// Get all expense categories
const expenseCategories = await CategoryService.list('expense')
```

---

##### `getById(id: string): Promise<Category | null>`

Retrieve a single category by ID.

**Example**:
```typescript
const category = await CategoryService.getById('cat_food')
```

---

##### `initializeDefaults(): Promise<void>`

Create default system categories on first app launch.

**Purpose**: Populate database with 12 default categories (see data-model.md)

**Called**: Once on app initialization

**Example**:
```typescript
// On first launch
if (!hasInitialized) {
  await CategoryService.initializeDefaults()
  setInitializedFlag()
}
```

---

### BalanceService

**Purpose**: Calculate and retrieve balance summaries (derived data)

#### Methods

##### `getTotalBalance(): Promise<number>`

Calculate total balance (all-time income - expenses).

**Output**: Total balance as number (CNY)

**Example**:
```typescript
const balance = await BalanceService.getTotalBalance()
// → 12450.50
```

---

##### `getMonthlyBalance(year: number, month: number): Promise<MonthlyBalance>`

Calculate balance for a specific month.

**Input**: year (e.g., 2025), month (1-12)

**Output**:
```typescript
interface MonthlyBalance {
  income: number        // Total income for the month
  expense: number       // Total expense for the month
  balance: number       // income - expense
  month: string         // YYYY-MM format
}
```

**Example**:
```typescript
const novBalance = await BalanceService.getMonthlyBalance(2025, 11)
// → { income: 5000, expense: 2350.75, balance: 2649.25, month: '2025-11' }
```

---

##### `getCurrentMonthBalance(): Promise<MonthlyBalance>`

Get balance for the current month (convenience method).

**Example**:
```typescript
const currentBalance = await BalanceService.getCurrentMonthBalance()
```

---

### TrendService

**Purpose**: Generate aggregated data for trend visualizations

#### Methods

##### `getCategoryBreakdown(options: CategoryBreakdownOptions): Promise<CategoryBreakdown>`

Get spending/income breakdown by category for a time period.

**Input**:
```typescript
interface CategoryBreakdownOptions {
  type: 'income' | 'expense'
  startDate: string     // ISO format
  endDate: string       // ISO format
}
```

**Output**:
```typescript
interface CategoryBreakdown {
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
```

**Example**:
```typescript
// Get expense breakdown for current month
const breakdown = await TrendService.getCategoryBreakdown({
  type: 'expense',
  startDate: '2025-11-01',
  endDate: '2025-11-30'
})

// Result:
// {
//   period: { start: '2025-11-01', end: '2025-11-30' },
//   type: 'expense',
//   data: [
//     { categoryId: 'cat_food', categoryName: '餐饮', total: 1200.50, percentage: 35.2, transactionCount: 45 },
//     { categoryId: 'cat_transport', categoryName: '交通', total: 800.00, percentage: 23.5, transactionCount: 20 }
//   ],
//   grandTotal: 3407.50
// }
```

---

##### `getTimeSeries(options: TimeSeriesOptions): Promise<TimeSeries>`

Get income/expense trends over time.

**Input**:
```typescript
interface TimeSeriesOptions {
  startDate: string     // ISO format
  endDate: string       // ISO format
  granularity: 'day' | 'week' | 'month' | 'year'
}
```

**Output**:
```typescript
interface TimeSeries {
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
```

**Example**:
```typescript
// Get last 6 months trend
const trend = await TrendService.getTimeSeries({
  startDate: '2025-06-01',
  endDate: '2025-11-30',
  granularity: 'month'
})

// Result:
// {
//   period: { start: '2025-06-01', end: '2025-11-30' },
//   granularity: 'month',
//   data: [
//     { period: '2025-06', income: 5000, expense: 2800, balance: 2200 },
//     { period: '2025-07', income: 5200, expense: 3100, balance: 2100 },
//     ...
//   ]
// }
```

---

##### `getTopCategories(options: TopCategoriesOptions): Promise<TopCategory[]>`

Get top N categories by spending/income.

**Input**:
```typescript
interface TopCategoriesOptions {
  type: 'income' | 'expense'
  startDate: string
  endDate: string
  limit: number         // Default: 5
}
```

**Output**:
```typescript
interface TopCategory {
  categoryId: string
  categoryName: string
  total: number
  transactionCount: number
}
```

**Example**:
```typescript
// Get top 5 expense categories for current month
const topExpenses = await TrendService.getTopCategories({
  type: 'expense',
  startDate: '2025-11-01',
  endDate: '2025-11-30',
  limit: 5
})
```

---

## Error Handling

### Standard Error Types

All service methods may throw these errors:

```typescript
// Base error
class ServiceError extends Error {
  code: string
  details?: any
}

// Specific errors
class ValidationError extends ServiceError {
  code = 'VALIDATION_ERROR'
}

class NotFoundError extends ServiceError {
  code = 'NOT_FOUND'
}

class DuplicateError extends ServiceError {
  code = 'DUPLICATE'
}

class PermissionError extends ServiceError {
  code = 'PERMISSION_DENIED'
}

class StorageError extends ServiceError {
  code = 'STORAGE_ERROR'
}
```

### Error Response Format

```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
```

**Example**:
```typescript
try {
  await TransactionService.create({
    amount: -50,  // Invalid
    type: 'expense',
    categoryId: 'cat_food',
    date: '2025-11-20'
  })
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
    console.error(error.message) // "Amount must be positive"
  }
}
```

---

## Service Implementation Notes

### Storage Abstraction

Services should abstract storage mechanism:

```typescript
// storage.adapter.ts
interface StorageAdapter {
  get(collection: string, query: any): Promise<any[]>
  getById(collection: string, id: string): Promise<any | null>
  create(collection: string, data: any): Promise<any>
  update(collection: string, id: string, data: any): Promise<any>
  delete(collection: string, id: string): Promise<void>
}

// Implementations:
// - WeChat Cloud DB Adapter
// - Local Storage Adapter
```

### Validation Layer

Use a validation library or custom validators:

```typescript
// validators/transaction.validator.ts
export const validateCreateTransaction = (input: CreateTransactionInput) => {
  const errors: string[] = []
  
  if (input.amount <= 0) {
    errors.push('Amount must be positive')
  }
  
  if (!/^\d+(\.\d{1,2})?$/.test(input.amount.toString())) {
    errors.push('Amount can have at most 2 decimal places')
  }
  
  if (!['income', 'expense'].includes(input.type)) {
    errors.push('Type must be income or expense')
  }
  
  // ... more validations
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '))
  }
}
```

### Caching Strategy

Implement caching for computed data:

```typescript
// cache.service.ts
class CacheService {
  private cache = new Map<string, { data: any, timestamp: number }>()
  private ttl = 60000 // 1 minute
  
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
  
  invalidate(pattern: string): void {
    // Invalidate keys matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

// Usage in BalanceService
async getTotalBalance(): Promise<number> {
  const cached = cacheService.get('total-balance')
  if (cached !== null) return cached
  
  const balance = await calculateTotalBalance()
  cacheService.set('total-balance', balance)
  return balance
}
```

---

## Summary

**Core Services**:
1. **TransactionService**: CRUD for transactions
2. **CategoryService**: Manage categories
3. **BalanceService**: Calculate balances (derived)
4. **TrendService**: Generate trend data (derived)

**Key Patterns**:
- All async operations return Promises
- Consistent error handling with typed errors
- Input validation at service layer
- Storage abstraction for platform flexibility
- Caching for computed data

**Next Steps**:
- Implement services with storage adapters
- Write unit tests for each service method
- Create integration tests for data flows
