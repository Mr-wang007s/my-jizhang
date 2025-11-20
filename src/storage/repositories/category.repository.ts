/**
 * Category Repository
 * Handles CRUD operations for categories
 */

import { db } from '../database'
import { Category, CreateCategoryInput, UpdateCategoryInput, CategoryType } from '../../models/Category'

export class CategoryRepository {
  /**
   * Get all categories
   */
  async findAll(): Promise<Category[]> {
    const sql = `
      SELECT id, name, type, icon, created_at, updated_at
      FROM category
      ORDER BY created_at ASC
    `
    return await db.query<Category>(sql)
  }

  /**
   * Get categories by type
   */
  async findByType(type: CategoryType): Promise<Category[]> {
    const sql = `
      SELECT id, name, type, icon, created_at, updated_at
      FROM category
      WHERE type = ? OR type = 'both'
      ORDER BY created_at ASC
    `
    return await db.query<Category>(sql, [type])
  }

  /**
   * Get category by ID
   */
  async findById(id: number): Promise<Category | null> {
    const sql = `
      SELECT id, name, type, icon, created_at, updated_at
      FROM category
      WHERE id = ?
    `
    const results = await db.query<Category>(sql, [id])
    return results.length > 0 ? results[0] : null
  }

  /**
   * Get category by name
   */
  async findByName(name: string): Promise<Category | null> {
    const sql = `
      SELECT id, name, type, icon, created_at, updated_at
      FROM category
      WHERE name = ?
    `
    const results = await db.query<Category>(sql, [name])
    return results.length > 0 ? results[0] : null
  }

  /**
   * Create new category
   */
  async create(input: CreateCategoryInput): Promise<Category> {
    const now = new Date().toISOString()
    const sql = `
      INSERT INTO category (name, type, icon, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `
    const id = await db.insert(sql, [
      input.name,
      input.type,
      input.icon || null,
      now,
      now
    ])

    const created = await this.findById(id)
    if (!created) {
      throw new Error('Failed to create category')
    }
    return created
  }

  /**
   * Update category
   */
  async update(id: number, input: UpdateCategoryInput): Promise<Category> {
    const now = new Date().toISOString()
    const updates: string[] = []
    const params: any[] = []

    if (input.name !== undefined) {
      updates.push('name = ?')
      params.push(input.name)
    }
    if (input.type !== undefined) {
      updates.push('type = ?')
      params.push(input.type)
    }
    if (input.icon !== undefined) {
      updates.push('icon = ?')
      params.push(input.icon)
    }

    if (updates.length === 0) {
      const existing = await this.findById(id)
      if (!existing) {
        throw new Error('Category not found')
      }
      return existing
    }

    updates.push('updated_at = ?')
    params.push(now)
    params.push(id)

    const sql = `
      UPDATE category
      SET ${updates.join(', ')}
      WHERE id = ?
    `
    await db.update(sql, params)

    const updated = await this.findById(id)
    if (!updated) {
      throw new Error('Category not found after update')
    }
    return updated
  }

  /**
   * Delete category
   */
  async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM category WHERE id = ?'
    const affected = await db.delete(sql, [id])
    return affected > 0
  }

  /**
   * Check if category exists
   */
  async exists(name: string): Promise<boolean> {
    const category = await this.findByName(name)
    return category !== null
  }

  /**
   * Get category count
   */
  async count(): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM category'
    const results = await db.query<{ count: number }>(sql)
    return results.length > 0 ? results[0].count : 0
  }
}

// Export singleton instance
export const categoryRepository = new CategoryRepository()
