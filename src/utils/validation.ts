import { isDateInRange } from './date';

/**
 * Validate transaction amount
 * @param amount - Amount to validate
 * @returns { valid, error }
 */
export function validateAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: '金额必须是数字' };
  }

  if (amount <= 0) {
    return { valid: false, error: '金额必须大于0' };
  }

  if (amount > 999999999.99) {
    return { valid: false, error: '金额超出最大限制' };
  }

  // Check decimal places (max 2)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { valid: false, error: '金额最多保留2位小数' };
  }

  return { valid: true };
}

/**
 * Validate transaction date
 * @param date - Date string to validate (YYYY-MM-DD)
 * @returns { valid, error }
 */
export function validateDate(date: string): { valid: boolean; error?: string } {
  if (!date) {
    return { valid: false, error: '日期不能为空' };
  }

  // Check format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { valid: false, error: '日期格式必须为 YYYY-MM-DD' };
  }

  // Check if date is valid
  const timestamp = Date.parse(date);
  if (isNaN(timestamp)) {
    return { valid: false, error: '无效的日期' };
  }

  // Check if date is within allowed range
  if (!isDateInRange(date)) {
    return { valid: false, error: '日期超出允许范围 (10年前至7天后)' };
  }

  return { valid: true };
}

/**
 * Validate category ID
 * @param categoryId - Category ID to validate
 * @returns { valid, error }
 */
export function validateCategoryId(categoryId: string): { valid: boolean; error?: string } {
  if (!categoryId || categoryId.trim().length === 0) {
    return { valid: false, error: '分类不能为空' };
  }

  return { valid: true };
}

/**
 * Validate note (optional field)
 * @param note - Note text to validate
 * @returns { valid, error }
 */
export function validateNote(note?: string): { valid: boolean; error?: string } {
  if (!note) {
    return { valid: true }; // Note is optional
  }

  if (note.length > 200) {
    return { valid: false, error: '备注不能超过200个字符' };
  }

  return { valid: true };
}

/**
 * Validate category name
 * @param name - Category name to validate
 * @returns { valid, error }
 */
export function validateCategoryName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: '分类名称不能为空' };
  }

  if (name.length > 20) {
    return { valid: false, error: '分类名称不能超过20个字符' };
  }

  return { valid: true };
}

/**
 * Validate hex color
 * @param color - Color hex code to validate
 * @returns { valid, error }
 */
export function validateColor(color?: string): { valid: boolean; error?: string } {
  if (!color) {
    return { valid: true }; // Color is optional
  }

  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexRegex.test(color)) {
    return { valid: false, error: '颜色必须是有效的十六进制格式 (如 #FF5733)' };
  }

  return { valid: true };
}

/**
 * Validate transaction type
 * @param type - Transaction type to validate
 * @returns { valid, error }
 */
export function validateType(type: string): { valid: boolean; error?: string } {
  if (type !== 'income' && type !== 'expense') {
    return { valid: false, error: '类型必须是 income 或 expense' };
  }

  return { valid: true };
}
