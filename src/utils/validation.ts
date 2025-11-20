/**
 * Validation utility functions
 */

import { parseDate, isDateInAllowedRange } from './date'

/**
 * Validate transaction amount
 * @param amount - Amount to validate
 * @returns Object with isValid flag and error message
 */
export const validateAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { isValid: false, error: '金额必须是数字' }
  }
  
  if (amount <= 0) {
    return { isValid: false, error: '金额必须大于0' }
  }
  
  if (amount > 999999999.99) {
    return { isValid: false, error: '金额超出最大限制' }
  }
  
  // Check decimal places (max 2)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length
  if (decimalPlaces > 2) {
    return { isValid: false, error: '金额最多保留两位小数' }
  }
  
  return { isValid: true }
}

/**
 * Validate transaction date
 * @param date - Date string to validate (YYYY-MM-DD)
 * @returns Object with isValid flag and error message
 */
export const validateDate = (date: string): { isValid: boolean; error?: string } => {
  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { isValid: false, error: '日期格式必须为 YYYY-MM-DD' }
  }
  
  // Parse date
  const parsed = parseDate(date)
  if (!parsed) {
    return { isValid: false, error: '日期无效' }
  }
  
  // Check if in allowed range
  if (!isDateInAllowedRange(date)) {
    return { isValid: false, error: '日期不在允许的范围内（不能超过10年前或7天后）' }
  }
  
  return { isValid: true }
}

/**
 * Validate category name
 * @param name - Category name to validate
 * @returns Object with isValid flag and error message
 */
export const validateCategoryName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: '分类名称不能为空' }
  }
  
  if (name.length > 20) {
    return { isValid: false, error: '分类名称最多20个字符' }
  }
  
  return { isValid: true }
}

/**
 * Validate hex color code
 * @param color - Color hex code to validate
 * @returns Object with isValid flag and error message
 */
export const validateColor = (color: string): { isValid: boolean; error?: string } => {
  if (!color) {
    return { isValid: true } // Color is optional
  }
  
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!hexColorRegex.test(color)) {
    return { isValid: false, error: '颜色必须是有效的十六进制格式（例如 #FF5733）' }
  }
  
  return { isValid: true }
}

/**
 * Validate note/description text
 * @param note - Note text to validate
 * @returns Object with isValid flag and error message
 */
export const validateNote = (note?: string): { isValid: boolean; error?: string } => {
  if (!note) {
    return { isValid: true } // Note is optional
  }
  
  if (note.length > 200) {
    return { isValid: false, error: '备注最多200个字符' }
  }
  
  return { isValid: true }
}

/**
 * Validate category ID exists (this would typically check against database)
 * @param categoryId - Category ID to validate
 * @returns Object with isValid flag and error message
 */
export const validateCategoryId = (categoryId: string): { isValid: boolean; error?: string } => {
  if (!categoryId || categoryId.trim().length === 0) {
    return { isValid: false, error: '分类ID不能为空' }
  }
  
  // Basic format check (real validation would check database)
  if (categoryId.length < 3) {
    return { isValid: false, error: '分类ID格式无效' }
  }
  
  return { isValid: true }
}

/**
 * Validate transaction type
 * @param type - Transaction type to validate
 * @returns Object with isValid flag and error message
 */
export const validateTransactionType = (type: string): { isValid: boolean; error?: string } => {
  if (!['income', 'expense'].includes(type)) {
    return { isValid: false, error: '类型必须是 income 或 expense' }
  }
  
  return { isValid: true }
}

/**
 * Validate category type
 * @param type - Category type to validate
 * @returns Object with isValid flag and error message
 */
export const validateCategoryType = (type: string): { isValid: boolean; error?: string } => {
  if (!['income', 'expense', 'both'].includes(type)) {
    return { isValid: false, error: '类型必须是 income、expense 或 both' }
  }
  
  return { isValid: true }
}

/**
 * Validate all transaction fields at once
 * @param data - Transaction data to validate
 * @returns Object with isValid flag and array of error messages
 */
export const validateTransaction = (data: {
  amount: number
  type: string
  categoryId: string
  date: string
  note?: string
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  const amountCheck = validateAmount(data.amount)
  if (!amountCheck.isValid) errors.push(amountCheck.error!)
  
  const typeCheck = validateTransactionType(data.type)
  if (!typeCheck.isValid) errors.push(typeCheck.error!)
  
  const categoryCheck = validateCategoryId(data.categoryId)
  if (!categoryCheck.isValid) errors.push(categoryCheck.error!)
  
  const dateCheck = validateDate(data.date)
  if (!dateCheck.isValid) errors.push(dateCheck.error!)
  
  if (data.note) {
    const noteCheck = validateNote(data.note)
    if (!noteCheck.isValid) errors.push(noteCheck.error!)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate all category fields at once
 * @param data - Category data to validate
 * @returns Object with isValid flag and array of error messages
 */
export const validateCategory = (data: {
  name: string
  type: string
  color?: string
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  const nameCheck = validateCategoryName(data.name)
  if (!nameCheck.isValid) errors.push(nameCheck.error!)
  
  const typeCheck = validateCategoryType(data.type)
  if (!typeCheck.isValid) errors.push(typeCheck.error!)
  
  if (data.color) {
    const colorCheck = validateColor(data.color)
    if (!colorCheck.isValid) errors.push(colorCheck.error!)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
