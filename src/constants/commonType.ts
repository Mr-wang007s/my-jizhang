import { TransactionType } from './transaction'

// Transaction Interface
export interface ITransaction {
  id: string
  type: TransactionType
  amount: number
  categoryId: string
  categoryName: string
  categoryIcon: string
  note: string
  date: string
  createdAt: string
}

// Category Interface
export interface ICategory {
  id: string
  name: string
  icon: string
  color: string
  type: TransactionType
}

// Filter Interface
export interface IFilter {
  type: 'all' | TransactionType
  categoryId: string
  startDate: string
  endDate: string
  searchText: string
}

// Statistics Interface
export interface IStatistics {
  totalIncome: number
  totalExpense: number
  balance: number
  categoryStats: ICategoryStats[]
  monthlyStats: IMonthlyStats[]
}

export interface ICategoryStats {
  categoryId: string
  categoryName: string
  categoryIcon: string
  categoryColor: string
  amount: number
  count: number
  percentage: number
}

export interface IMonthlyStats {
  month: string
  income: number
  expense: number
  balance: number
}
