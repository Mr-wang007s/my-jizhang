// Transaction Action Types
export const ADD_TRANSACTION = 'ADD_TRANSACTION'
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION'
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS'
export const SET_FILTER = 'SET_FILTER'

// Transaction Types
export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

// Default Categories
export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: '1', name: '餐饮', icon: '🍔', color: '#FF6B6B', type: TransactionType.EXPENSE },
  { id: '2', name: '交通', icon: '🚗', color: '#4ECDC4', type: TransactionType.EXPENSE },
  { id: '3', name: '购物', icon: '🛍️', color: '#95E1D3', type: TransactionType.EXPENSE },
  { id: '4', name: '娱乐', icon: '🎮', color: '#FFE66D', type: TransactionType.EXPENSE },
  { id: '5', name: '医疗', icon: '💊', color: '#FF9999', type: TransactionType.EXPENSE },
  { id: '6', name: '住房', icon: '🏠', color: '#F38181', type: TransactionType.EXPENSE },
  { id: '7', name: '通讯', icon: '📱', color: '#5C7CFA', type: TransactionType.EXPENSE },
  { id: '8', name: '其他', icon: '📝', color: '#999999', type: TransactionType.EXPENSE },
]

export const DEFAULT_INCOME_CATEGORIES = [
  { id: '101', name: '工资', icon: '💰', color: '#51CF66', type: TransactionType.INCOME },
  { id: '102', name: '兼职', icon: '💼', color: '#94D82D', type: TransactionType.INCOME },
  { id: '103', name: '理财', icon: '📈', color: '#4CAF50', type: TransactionType.INCOME },
  { id: '104', name: '红包', icon: '🧧', color: '#FF6B6B', type: TransactionType.INCOME },
  { id: '105', name: '其他', icon: '💵', color: '#81C784', type: TransactionType.INCOME },
]
