/**
 * Integration tests for TransactionService
 */

import { TransactionService } from '@/services/transaction.service'
import { CreateTransactionInput } from '@/types'
import { storageAdapter } from '@/services/storage.adapter'

// Mock the storage adapter
jest.mock('@/services/storage.adapter')

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should create a new transaction with valid input', async () => {
      const input: CreateTransactionInput = {
        amount: 100.50,
        type: 'expense',
        categoryId: 'cat_food',
        date: '2025-11-20',
        note: 'Test transaction'
      }

      const mockCreated = {
        _id: 'txn_123',
        ...input,
        createdAt: '2025-11-20T12:00:00.000Z',
        updatedAt: '2025-11-20T12:00:00.000Z'
      }

      ;(storageAdapter.create as jest.Mock).mockResolvedValue(mockCreated)

      const result = await TransactionService.create(input)

      expect(result).toEqual(mockCreated)
      expect(storageAdapter.create).toHaveBeenCalledWith(
        'transactions',
        expect.objectContaining({
          amount: 100.50,
          type: 'expense',
          categoryId: 'cat_food',
          date: '2025-11-20',
          note: 'Test transaction'
        })
      )
    })

    it('should reject negative amounts', async () => {
      const input: CreateTransactionInput = {
        amount: -50,
        type: 'expense',
        categoryId: 'cat_food',
        date: '2025-11-20'
      }

      await expect(TransactionService.create(input)).rejects.toThrow('金额必须大于0')
    })

    it('should reject amounts with more than 2 decimal places', async () => {
      const input: CreateTransactionInput = {
        amount: 100.123,
        type: 'expense',
        categoryId: 'cat_food',
        date: '2025-11-20'
      }

      await expect(TransactionService.create(input)).rejects.toThrow('两位小数')
    })

    it('should reject invalid dates', async () => {
      const input: CreateTransactionInput = {
        amount: 100,
        type: 'expense',
        categoryId: 'cat_food',
        date: 'invalid-date'
      }

      await expect(TransactionService.create(input)).rejects.toThrow()
    })
  })

  describe('list', () => {
    it('should list transactions with default pagination', async () => {
      const mockTransactions = [
        {
          _id: 'txn_1',
          amount: 100,
          type: 'expense' as const,
          categoryId: 'cat_food',
          date: '2025-11-20',
          createdAt: '2025-11-20T12:00:00.000Z',
          updatedAt: '2025-11-20T12:00:00.000Z'
        },
        {
          _id: 'txn_2',
          amount: 50,
          type: 'income' as const,
          categoryId: 'cat_salary',
          date: '2025-11-19',
          createdAt: '2025-11-19T12:00:00.000Z',
          updatedAt: '2025-11-19T12:00:00.000Z'
        }
      ]

      ;(storageAdapter.get as jest.Mock).mockResolvedValue(mockTransactions)
      ;(storageAdapter.count as jest.Mock).mockResolvedValue(2)

      const result = await TransactionService.list()

      expect(result.data).toEqual(mockTransactions)
      expect(result.total).toBe(2)
      expect(result.hasMore).toBe(false)
    })

    it('should filter transactions by type', async () => {
      const mockTransactions = [
        {
          _id: 'txn_1',
          amount: 100,
          type: 'expense' as const,
          categoryId: 'cat_food',
          date: '2025-11-20',
          createdAt: '2025-11-20T12:00:00.000Z',
          updatedAt: '2025-11-20T12:00:00.000Z'
        }
      ]

      ;(storageAdapter.get as jest.Mock).mockResolvedValue(mockTransactions)
      ;(storageAdapter.count as jest.Mock).mockResolvedValue(1)

      const result = await TransactionService.list({ type: 'expense' })

      expect(result.data).toHaveLength(1)
      expect(result.data[0].type).toBe('expense')
    })

    it('should support pagination', async () => {
      const mockTransactions = Array.from({ length: 10 }, (_, i) => ({
        _id: `txn_${i}`,
        amount: 100,
        type: 'expense' as const,
        categoryId: 'cat_food',
        date: '2025-11-20',
        createdAt: '2025-11-20T12:00:00.000Z',
        updatedAt: '2025-11-20T12:00:00.000Z'
      }))

      ;(storageAdapter.get as jest.Mock).mockResolvedValue(mockTransactions.slice(0, 5))
      ;(storageAdapter.count as jest.Mock).mockResolvedValue(10)

      const result = await TransactionService.list({ limit: 5, offset: 0 })

      expect(result.data).toHaveLength(5)
      expect(result.total).toBe(10)
      expect(result.hasMore).toBe(true)
    })
  })

  describe('update', () => {
    it('should update a transaction', async () => {
      const mockUpdated = {
        _id: 'txn_123',
        amount: 150,
        type: 'expense' as const,
        categoryId: 'cat_food',
        date: '2025-11-20',
        note: 'Updated note',
        createdAt: '2025-11-20T12:00:00.000Z',
        updatedAt: '2025-11-20T13:00:00.000Z'
      }

      ;(storageAdapter.update as jest.Mock).mockResolvedValue(mockUpdated)

      const result = await TransactionService.update('txn_123', {
        amount: 150,
        note: 'Updated note'
      })

      expect(result).toEqual(mockUpdated)
      expect(storageAdapter.update).toHaveBeenCalledWith(
        'transactions',
        'txn_123',
        expect.objectContaining({
          amount: 150,
          note: 'Updated note'
        })
      )
    })
  })

  describe('delete', () => {
    it('should delete a transaction', async () => {
      ;(storageAdapter.delete as jest.Mock).mockResolvedValue(undefined)

      await TransactionService.delete('txn_123')

      expect(storageAdapter.delete).toHaveBeenCalledWith('transactions', 'txn_123')
    })
  })
})
