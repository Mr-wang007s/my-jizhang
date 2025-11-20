/**
 * Zustand global store for application state
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { Transaction, Category } from '../types'

// Storage adapter for Taro
const taroStorage = {
  getItem: (key: string): string | null => {
    try {
      return Taro.getStorageSync(key) || null
    } catch (e) {
      console.error('Failed to get storage:', e)
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      Taro.setStorageSync(key, value)
    } catch (e) {
      console.error('Failed to set storage:', e)
    }
  },
  removeItem: (key: string): void => {
    try {
      Taro.removeStorageSync(key)
    } catch (e) {
      console.error('Failed to remove storage:', e)
    }
  },
}

// Store state interface
interface AppState {
  // State
  transactions: Transaction[]
  categories: Category[]
  balance: number
  loading: boolean
  
  // Actions
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setCategories: (categories: Category[]) => void
  setLoading: (loading: boolean) => void
  updateBalance: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      transactions: [],
      categories: [],
      balance: 0,
      loading: false,
      
      // Actions
      setTransactions: (transactions) => {
        set({ transactions })
        get().updateBalance()
      },
      
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }))
        get().updateBalance()
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t._id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }))
        get().updateBalance()
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t._id !== id),
        }))
        get().updateBalance()
      },
      
      setCategories: (categories) => set({ categories }),
      
      setLoading: (loading) => set({ loading }),
      
      updateBalance: () => {
        const { transactions } = get()
        const balance = transactions.reduce((sum, t) => {
          return sum + (t.type === 'income' ? t.amount : -t.amount)
        }, 0)
        set({ balance: Math.round(balance * 100) / 100 })
      },
    }),
    {
      name: 'jizhang-storage',
      storage: createJSONStorage(() => taroStorage),
      // Only persist transactions and categories, not loading state or derived balance
      partialize: (state) => ({
        transactions: state.transactions,
        categories: state.categories,
      }),
    }
  )
)
