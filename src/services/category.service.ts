/**
 * Category Service - Manage transaction categories
 */

import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  ValidationError,
  NotFoundError,
  DuplicateError
} from '../types'
import { storageAdapter } from './storage.adapter'
import { validateCategory } from '../utils/validation'

// Default categories to initialize on first launch
const DEFAULT_CATEGORIES = [
  // Income categories
  { _id: 'cat_salary', name: '工资', icon: '💼', color: '#34D399', type: 'income' as const, order: 1 },
  { _id: 'cat_bonus', name: '奖金', icon: '🎁', color: '#10B981', type: 'income' as const, order: 2 },
  { _id: 'cat_investment', name: '投资收益', icon: '📈', color: '#059669', type: 'income' as const, order: 3 },
  
  // Expense categories
  { _id: 'cat_food', name: '餐饮', icon: '🍜', color: '#EF4444', type: 'expense' as const, order: 10 },
  { _id: 'cat_transport', name: '交通', icon: '🚗', color: '#DC2626', type: 'expense' as const, order: 11 },
  { _id: 'cat_shopping', name: '购物', icon: '🛍️', color: '#B91C1C', type: 'expense' as const, order: 12 },
  { _id: 'cat_utilities', name: '水电费', icon: '💡', color: '#991B1B', type: 'expense' as const, order: 13 },
  { _id: 'cat_entertainment', name: '娱乐', icon: '🎮', color: '#7F1D1D', type: 'expense' as const, order: 14 },
  { _id: 'cat_healthcare', name: '医疗', icon: '🏥', color: '#F87171', type: 'expense' as const, order: 15 },
  { _id: 'cat_education', name: '教育', icon: '📚', color: '#FCA5A5', type: 'expense' as const, order: 16 },
  { _id: 'cat_housing', name: '住房', icon: '🏠', color: '#FEE2E2', type: 'expense' as const, order: 17 },
  
  // Both
  { _id: 'cat_other', name: '其他', icon: '⭐', color: '#6B7280', type: 'both' as const, order: 100 }
]

export class CategoryService {
  /**
   * Initialize default categories on first app launch
   */
  static async initializeDefaults(): Promise<void> {
    // Check if categories already exist
    const count = await storageAdapter.count('categories')
    if (count > 0) {
      return // Already initialized
    }

    // Create all default categories
    const createdAt = new Date().toISOString()
    
    for (const category of DEFAULT_CATEGORIES) {
      await storageAdapter.create('categories', {
        ...category,
        isDefault: true,
        createdAt
      })
    }
  }

  /**
   * List all categories, optionally filtered by type
   */
  static async list(type?: 'income' | 'expense' | 'both'): Promise<Category[]> {
    const query: any = {}
    
    if (type) {
      // For categories, match either the specific type or 'both'
      query.type = type
    }

    let categories = await storageAdapter.get<Category>('categories', query)
    
    // Sort by order
    categories.sort((a, b) => a.order - b.order)
    
    return categories
  }

  /**
   * Get category by ID
   */
  static async getById(id: string): Promise<Category | null> {
    return await storageAdapter.getById<Category>('categories', id)
  }

  /**
   * Create a new custom category
   */
  static async create(input: CreateCategoryInput): Promise<Category> {
    // Validate input
    const validation = validateCategory(input)
    if (!validation.isValid) {
      throw new ValidationError(validation.errors.join(', '))
    }

    // Check for duplicate name
    const existing = await this.list()
    const duplicate = existing.find(c => c.name === input.name)
    if (duplicate) {
      throw new DuplicateError(`Category with name "${input.name}" already exists`)
    }

    // Determine order (place at end of type group)
    const sameTypeCategories = existing.filter(c => c.type === input.type || c.type === 'both')
    const maxOrder = sameTypeCategories.reduce((max, c) => Math.max(max, c.order), 0)

    const category = {
      ...input,
      isDefault: false,
      order: maxOrder + 1,
      createdAt: new Date().toISOString()
    }

    const created = await storageAdapter.create<Category>('categories', category)
    return created
  }

  /**
   * Update a category (name, icon, color, order)
   */
  static async update(id: string, updates: UpdateCategoryInput): Promise<Category> {
    const current = await this.getById(id)
    if (!current) {
      throw new NotFoundError(`Category with id ${id} not found`)
    }

    // Validate updates
    if (updates.name !== undefined) {
      const validation = validateCategory({ 
        name: updates.name, 
        type: current.type 
      })
      if (!validation.isValid) {
        throw new ValidationError(validation.errors.join(', '))
      }

      // Check for duplicate name (excluding current category)
      const existing = await this.list()
      const duplicate = existing.find(c => c._id !== id && c.name === updates.name)
      if (duplicate) {
        throw new DuplicateError(`Category with name "${updates.name}" already exists`)
      }
    }

    const updated = await storageAdapter.update<Category>('categories', id, updates)
    return updated
  }

  /**
   * Delete a category (only custom categories, not defaults)
   */
  static async delete(id: string, reassignToCategoryId: string): Promise<void> {
    const category = await this.getById(id)
    if (!category) {
      throw new NotFoundError(`Category with id ${id} not found`)
    }

    if (category.isDefault) {
      throw new ValidationError('Cannot delete default categories')
    }

    // Verify reassign target exists
    const reassignTarget = await this.getById(reassignToCategoryId)
    if (!reassignTarget) {
      throw new NotFoundError(`Reassign target category ${reassignToCategoryId} not found`)
    }

    // Reassign transactions to the target category
    // This would need to be implemented with transaction service integration
    // For now, we'll just delete the category
    // TODO: Implement transaction reassignment
    
    await storageAdapter.delete('categories', id)
  }
}
