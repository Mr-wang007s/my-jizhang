import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Taro from '@tarojs/taro';
import type { Transaction, Category } from '../types';

interface AppState {
  // State
  transactions: Transaction[];
  categories: Category[];
  balance: number;
  loading: boolean;

  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setBalance: (balance: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      transactions: [],
      categories: [],
      balance: 0,
      loading: false,

      // Actions
      setTransactions: (transactions) => set({ transactions }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t._id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t._id !== id),
        })),

      setCategories: (categories) => set({ categories }),

      setLoading: (loading) => set({ loading }),

      setBalance: (balance) => set({ balance }),
    }),
    {
      name: 'jizhang-storage',
      getStorage: () => ({
        getItem: (key) => {
          const value = Taro.getStorageSync(key);
          return value || null;
        },
        setItem: (key, value) => {
          Taro.setStorageSync(key, value);
        },
        removeItem: (key) => {
          Taro.removeStorageSync(key);
        },
      }),
    }
  )
);
