/**
 * Category entity interface
 */

export type CategoryType = 'income' | 'expense' | 'both'

export interface Category {
  id: number
  name: string
  type: CategoryType
  icon?: string
  created_at: string
  updated_at: string
}

export interface CreateCategoryInput {
  name: string
  type: CategoryType
  icon?: string
}

export interface UpdateCategoryInput {
  name?: string
  type?: CategoryType
  icon?: string
}
