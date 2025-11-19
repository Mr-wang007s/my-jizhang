import Taro from '@tarojs/taro'
import { ITransaction, ICategory } from '../constants/commonType'
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants/transaction'

const STORAGE_KEYS = {
  TRANSACTIONS: 'jizhang_transactions',
  CATEGORIES: 'jizhang_categories',
}

class StorageService {
  // Transaction Methods
  getTransactions(): ITransaction[] {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.TRANSACTIONS)
      return data ? JSON.parse(data) : []
    } catch (e) {
      console.error('Failed to get transactions:', e)
      return []
    }
  }

  saveTransaction(transaction: ITransaction): void {
    try {
      const transactions = this.getTransactions()
      const existingIndex = transactions.findIndex(t => t.id === transaction.id)

      if (existingIndex !== -1) {
        transactions[existingIndex] = transaction
      } else {
        transactions.push(transaction)
      }

      Taro.setStorageSync(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    } catch (e) {
      console.error('Failed to save transaction:', e)
      throw e
    }
  }

  deleteTransaction(id: string): void {
    try {
      const transactions = this.getTransactions().filter(t => t.id !== id)
      Taro.setStorageSync(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
    } catch (e) {
      console.error('Failed to delete transaction:', e)
      throw e
    }
  }

  // Category Methods
  getCategories(): ICategory[] {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.CATEGORIES)
      if (data) {
        return JSON.parse(data)
      } else {
        // Initialize with default categories
        const defaultCategories = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]
        this.saveCategories(defaultCategories)
        return defaultCategories
      }
    } catch (e) {
      console.error('Failed to get categories:', e)
      return [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]
    }
  }

  saveCategories(categories: ICategory[]): void {
    try {
      Taro.setStorageSync(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
    } catch (e) {
      console.error('Failed to save categories:', e)
      throw e
    }
  }

  saveCategory(category: ICategory): void {
    try {
      const categories = this.getCategories()
      const existingIndex = categories.findIndex(c => c.id === category.id)

      if (existingIndex !== -1) {
        categories[existingIndex] = category
      } else {
        categories.push(category)
      }

      this.saveCategories(categories)
    } catch (e) {
      console.error('Failed to save category:', e)
      throw e
    }
  }

  deleteCategory(id: string): void {
    try {
      const categories = this.getCategories().filter(c => c.id !== id)
      this.saveCategories(categories)
    } catch (e) {
      console.error('Failed to delete category:', e)
      throw e
    }
  }

  // Clear all data
  clearAll(): void {
    try {
      Taro.removeStorageSync(STORAGE_KEYS.TRANSACTIONS)
      Taro.removeStorageSync(STORAGE_KEYS.CATEGORIES)
    } catch (e) {
      console.error('Failed to clear storage:', e)
      throw e
    }
  }
}

export default new StorageService()
