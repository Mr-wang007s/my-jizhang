import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types';
import { ValidationError, NotFoundError } from '../types';
import { validateCategoryName, validateColor } from '../utils/validation';
import { getTimestamp } from '../utils/date';
import { getStorageAdapter } from './storage.adapter';

const COLLECTION = 'categories';
const storage = getStorageAdapter();

// In-memory cache for categories (improves performance)
let categoriesCache: Category[] | null = null;

export class CategoryService {
  /**
   * Initialize default categories on first app launch
   */
  static async initializeDefaults(): Promise<Category[]> {
    const defaultCategories: Omit<Category, '_id' | 'createdAt'>[] = [
      // Income categories
      { name: '工资', icon: '💼', type: 'income', isDefault: true, order: 1 },
      { name: '奖金', icon: '🎁', type: 'income', isDefault: true, order: 2 },
      { name: '投资收益', icon: '📈', type: 'income', isDefault: true, order: 3 },

      // Expense categories
      { name: '餐饮', icon: '🍜', type: 'expense', isDefault: true, order: 10 },
      { name: '交通', icon: '🚗', type: 'expense', isDefault: true, order: 11 },
      { name: '购物', icon: '🛍️', type: 'expense', isDefault: true, order: 12 },
      { name: '水电费', icon: '💡', type: 'expense', isDefault: true, order: 13 },
      { name: '娱乐', icon: '🎮', type: 'expense', isDefault: true, order: 14 },
      { name: '医疗', icon: '🏥', type: 'expense', isDefault: true, order: 15 },
      { name: '教育', icon: '📚', type: 'expense', isDefault: true, order: 16 },
      { name: '住房', icon: '🏠', type: 'expense', isDefault: true, order: 17 },

      // Both types
      { name: '其他', icon: '⭐', type: 'both', isDefault: true, order: 100 },
    ];

    const categories: Category[] = [];
    for (const cat of defaultCategories) {
      const category = await storage.create<Category>(COLLECTION, {
        ...cat,
        createdAt: getTimestamp(),
      });
      categories.push(category);
    }

    categoriesCache = categories;
    return categories;
  }

  /**
   * List all categories, optionally filtered by type
   */
  static async list(type?: 'income' | 'expense' | 'both'): Promise<Category[]> {
    // Use cache if available
    if (categoriesCache) {
      return this.filterAndSort(categoriesCache, type);
    }

    const categories = await storage.get<Category>(COLLECTION);
    categoriesCache = categories;

    return this.filterAndSort(categories, type);
  }

  /**
   * Get category by ID
   */
  static async getById(id: string): Promise<Category | null> {
    return await storage.getById<Category>(COLLECTION, id);
  }

  /**
   * Create a new custom category
   */
  static async create(input: CreateCategoryInput): Promise<Category> {
    // Validation
    const nameValidation = validateCategoryName(input.name);
    if (!nameValidation.valid) {
      throw new ValidationError(nameValidation.error!);
    }

    const colorValidation = validateColor(input.color);
    if (!colorValidation.valid) {
      throw new ValidationError(colorValidation.error!);
    }

    // Check for duplicate name
    const existing = await this.list();
    const duplicate = existing.find((cat) => cat.name === input.name);
    if (duplicate) {
      throw new ValidationError('分类名称已存在');
    }

    // Determine order (append to end)
    const maxOrder = existing.reduce((max, cat) => Math.max(max, cat.order), 0);

    const category = await storage.create<Category>(COLLECTION, {
      ...input,
      isDefault: false,
      order: maxOrder + 1,
      createdAt: getTimestamp(),
    });

    // Invalidate cache
    categoriesCache = null;

    return category;
  }

  /**
   * Update category
   */
  static async update(id: string, updates: UpdateCategoryInput): Promise<Category> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError('分类不存在');
    }

    // Validate name if provided
    if (updates.name) {
      const nameValidation = validateCategoryName(updates.name);
      if (!nameValidation.valid) {
        throw new ValidationError(nameValidation.error!);
      }

      // Check for duplicate name (excluding current category)
      const categories = await this.list();
      const duplicate = categories.find(
        (cat) => cat.name === updates.name && cat._id !== id
      );
      if (duplicate) {
        throw new ValidationError('分类名称已存在');
      }
    }

    // Validate color if provided
    if (updates.color) {
      const colorValidation = validateColor(updates.color);
      if (!colorValidation.valid) {
        throw new ValidationError(colorValidation.error!);
      }
    }

    const updated = await storage.update<Category>(COLLECTION, id, updates);

    // Invalidate cache
    categoriesCache = null;

    return updated;
  }

  /**
   * Delete category (default categories cannot be deleted)
   */
  static async delete(id: string): Promise<void> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError('分类不存在');
    }

    if (existing.isDefault) {
      throw new ValidationError('默认分类不能删除');
    }

    await storage.delete(COLLECTION, id);

    // Invalidate cache
    categoriesCache = null;
  }

  /**
   * Helper: Filter and sort categories
   */
  private static filterAndSort(
    categories: Category[],
    type?: 'income' | 'expense' | 'both'
  ): Category[] {
    let filtered = categories;

    if (type) {
      filtered = categories.filter((cat) => cat.type === type || cat.type === 'both');
    }

    return filtered.sort((a, b) => a.order - b.order);
  }
}
