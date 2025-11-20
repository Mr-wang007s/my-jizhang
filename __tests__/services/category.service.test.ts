/**
 * Integration tests for CategoryService
 */

import { CategoryService } from '@/services/category.service'
import { storageAdapter } from '@/services/storage.adapter'

// Mock the storage adapter
jest.mock('@/services/storage.adapter')

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('initializeDefaults', () => {
    it('should create 12 default categories', async () => {
      ;(storageAdapter.count as jest.Mock).mockResolvedValue(0)
      ;(storageAdapter.create as jest.Mock).mockImplementation(async (collection, data) => ({
        _id: data._id,
        ...data
      }))

      await CategoryService.initializeDefaults()

      expect(storageAdapter.create).toHaveBeenCalledTimes(12)
      
      // Verify some default categories
      expect(storageAdapter.create).toHaveBeenCalledWith(
        'categories',
        expect.objectContaining({
          name: '工资',
          type: 'income',
          isDefault: true
        })
      )
      
      expect(storageAdapter.create).toHaveBeenCalledWith(
        'categories',
        expect.objectContaining({
          name: '餐饮',
          type: 'expense',
          isDefault: true
        })
      )
    })

    it('should not create defaults if categories already exist', async () => {
      ;(storageAdapter.count as jest.Mock).mockResolvedValue(5)

      await CategoryService.initializeDefaults()

      expect(storageAdapter.create).not.toHaveBeenCalled()
    })
  })

  describe('list', () => {
    it('should list all categories', async () => {
      const mockCategories = [
        {
          _id: 'cat_food',
          name: '餐饮',
          icon: '🍜',
          color: '#FF5733',
          type: 'expense' as const,
          isDefault: true,
          order: 10,
          createdAt: '2025-11-20T00:00:00.000Z'
        },
        {
          _id: 'cat_salary',
          name: '工资',
          icon: '💼',
          color: '#34D399',
          type: 'income' as const,
          isDefault: true,
          order: 1,
          createdAt: '2025-11-20T00:00:00.000Z'
        }
      ]

      ;(storageAdapter.get as jest.Mock).mockResolvedValue(mockCategories)

      const result = await CategoryService.list()

      expect(result).toEqual(mockCategories)
      expect(storageAdapter.get).toHaveBeenCalledWith('categories', {})
    })

    it('should filter categories by type', async () => {
      const mockExpenseCategories = [
        {
          _id: 'cat_food',
          name: '餐饮',
          type: 'expense' as const,
          isDefault: true,
          order: 10,
          createdAt: '2025-11-20T00:00:00.000Z'
        }
      ]

      ;(storageAdapter.get as jest.Mock).mockResolvedValue(mockExpenseCategories)

      const result = await CategoryService.list('expense')

      expect(result).toEqual(mockExpenseCategories)
      expect(result[0].type).toBe('expense')
    })
  })

  describe('getById', () => {
    it('should get a category by ID', async () => {
      const mockCategory = {
        _id: 'cat_food',
        name: '餐饮',
        type: 'expense' as const,
        isDefault: true,
        order: 10,
        createdAt: '2025-11-20T00:00:00.000Z'
      }

      ;(storageAdapter.getById as jest.Mock).mockResolvedValue(mockCategory)

      const result = await CategoryService.getById('cat_food')

      expect(result).toEqual(mockCategory)
      expect(storageAdapter.getById).toHaveBeenCalledWith('categories', 'cat_food')
    })

    it('should return null for non-existent category', async () => {
      ;(storageAdapter.getById as jest.Mock).mockResolvedValue(null)

      const result = await CategoryService.getById('non_existent')

      expect(result).toBeNull()
    })
  })
})
