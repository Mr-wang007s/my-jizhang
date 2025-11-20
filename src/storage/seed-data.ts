/**
 * Seed data for initial categories
 */

import { categoryRepository } from './repositories/category.repository'
import { CreateCategoryInput } from '../models/Category'

/**
 * Default categories for expense
 */
const EXPENSE_CATEGORIES: CreateCategoryInput[] = [
  { name: '餐饮', type: 'expense', icon: 'food' },
  { name: '交通', type: 'expense', icon: 'transport' },
  { name: '购物', type: 'expense', icon: 'shopping' },
  { name: '娱乐', type: 'expense', icon: 'entertainment' },
  { name: '医疗', type: 'expense', icon: 'medical' },
  { name: '住房', type: 'expense', icon: 'housing' },
  { name: '通讯', type: 'expense', icon: 'communication' },
  { name: '教育', type: 'expense', icon: 'education' },
  { name: '其他', type: 'expense', icon: 'other' }
]

/**
 * Default categories for income
 */
const INCOME_CATEGORIES: CreateCategoryInput[] = [
  { name: '工资', type: 'income', icon: 'salary' },
  { name: '奖金', type: 'income', icon: 'bonus' },
  { name: '投资', type: 'income', icon: 'investment' },
  { name: '兼职', type: 'income', icon: 'parttime' },
  { name: '其他收入', type: 'income', icon: 'other' }
]

/**
 * Seed all default categories
 */
export async function seedCategories(): Promise<void> {
  try {
    console.log('[Seed] Starting category seeding...')

    // Check if categories already exist
    const count = await categoryRepository.count()
    if (count > 0) {
      console.log('[Seed] Categories already exist, skipping seed')
      return
    }

    // Seed expense categories
    for (const category of EXPENSE_CATEGORIES) {
      await categoryRepository.create(category)
    }
    console.log(`[Seed] Created ${EXPENSE_CATEGORIES.length} expense categories`)

    // Seed income categories
    for (const category of INCOME_CATEGORIES) {
      await categoryRepository.create(category)
    }
    console.log(`[Seed] Created ${INCOME_CATEGORIES.length} income categories`)

    console.log('[Seed] Category seeding completed successfully')
  } catch (error) {
    console.error('[Seed] Category seeding failed:', error)
    throw error
  }
}

/**
 * Reset all categories (for development/testing only)
 */
export async function resetCategories(): Promise<void> {
  console.warn('[Seed] Resetting all categories...')
  
  // Get all categories
  const categories = await categoryRepository.findAll()
  
  // Delete all categories
  for (const category of categories) {
    await categoryRepository.delete(category.id)
  }
  
  // Re-seed
  await seedCategories()
  
  console.log('[Seed] Categories reset completed')
}
