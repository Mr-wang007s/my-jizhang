/**
 * Unit tests for validation utilities
 */

import {
  validateAmount,
  validateDate,
  validateCategoryName,
  validateColor,
  validateNote,
  validateCategoryId,
  validateTransactionType,
  validateCategoryType,
  validateTransaction,
  validateCategory
} from '@/utils/validation'

describe('Validation Utilities', () => {
  describe('validateAmount', () => {
    it('should accept valid positive amounts', () => {
      expect(validateAmount(100)).toEqual({ isValid: true })
      expect(validateAmount(50.5)).toEqual({ isValid: true })
      expect(validateAmount(0.01)).toEqual({ isValid: true })
    })

    it('should accept amounts with max 2 decimal places', () => {
      expect(validateAmount(100.12)).toEqual({ isValid: true })
      expect(validateAmount(50.5)).toEqual({ isValid: true })
    })

    it('should reject negative amounts', () => {
      const result = validateAmount(-50)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('大于0')
    })

    it('should reject zero', () => {
      const result = validateAmount(0)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('大于0')
    })

    it('should reject non-numeric values', () => {
      const result = validateAmount(NaN)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('数字')
    })

    it('should reject amounts with more than 2 decimal places', () => {
      const result = validateAmount(100.123)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('两位小数')
    })

    it('should reject amounts exceeding maximum', () => {
      const result = validateAmount(1000000000)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('最大限制')
    })
  })

  describe('validateDate', () => {
    // Mock current date for consistent testing
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-11-20'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should accept valid date in YYYY-MM-DD format', () => {
      expect(validateDate('2025-11-20')).toEqual({ isValid: true })
      expect(validateDate('2025-01-01')).toEqual({ isValid: true })
    })

    it('should reject invalid date format', () => {
      const result = validateDate('2025/11/20')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('格式')
    })

    it('should reject invalid dates', () => {
      const result = validateDate('2025-13-40')
      expect(result.isValid).toBe(false)
    })

    it('should reject dates outside allowed range', () => {
      const result = validateDate('2014-01-01') // > 10 years ago
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('允许的范围')
    })
  })

  describe('validateCategoryName', () => {
    it('should accept valid category names', () => {
      expect(validateCategoryName('餐饮')).toEqual({ isValid: true })
      expect(validateCategoryName('Test Category')).toEqual({ isValid: true })
    })

    it('should reject empty names', () => {
      const result = validateCategoryName('')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('不能为空')
    })

    it('should reject names with only whitespace', () => {
      const result = validateCategoryName('   ')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('不能为空')
    })

    it('should reject names exceeding 20 characters', () => {
      const result = validateCategoryName('这是一个非常非常非常非常长的分类名称超过20字符')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('20个字符')
    })
  })

  describe('validateColor', () => {
    it('should accept valid hex colors', () => {
      expect(validateColor('#FF5733')).toEqual({ isValid: true })
      expect(validateColor('#abc')).toEqual({ isValid: true })
      expect(validateColor('#000000')).toEqual({ isValid: true })
    })

    it('should accept empty/undefined color (optional)', () => {
      expect(validateColor('')).toEqual({ isValid: true })
    })

    it('should reject invalid hex format', () => {
      const result = validateColor('FF5733')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('十六进制')
    })

    it('should reject invalid characters', () => {
      const result = validateColor('#GG5733')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('十六进制')
    })
  })

  describe('validateNote', () => {
    it('should accept valid notes', () => {
      expect(validateNote('午餐')).toEqual({ isValid: true })
      expect(validateNote('A valid note')).toEqual({ isValid: true })
    })

    it('should accept empty/undefined note (optional)', () => {
      expect(validateNote()).toEqual({ isValid: true })
      expect(validateNote('')).toEqual({ isValid: true })
    })

    it('should reject notes exceeding 200 characters', () => {
      const longNote = 'A'.repeat(201)
      const result = validateNote(longNote)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('200个字符')
    })
  })

  describe('validateCategoryId', () => {
    it('should accept valid category IDs', () => {
      expect(validateCategoryId('cat_food')).toEqual({ isValid: true })
      expect(validateCategoryId('category123')).toEqual({ isValid: true })
    })

    it('should reject empty category ID', () => {
      const result = validateCategoryId('')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('不能为空')
    })

    it('should reject very short IDs', () => {
      const result = validateCategoryId('ab')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('格式无效')
    })
  })

  describe('validateTransactionType', () => {
    it('should accept valid types', () => {
      expect(validateTransactionType('income')).toEqual({ isValid: true })
      expect(validateTransactionType('expense')).toEqual({ isValid: true })
    })

    it('should reject invalid types', () => {
      const result = validateTransactionType('invalid')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('income 或 expense')
    })
  })

  describe('validateCategoryType', () => {
    it('should accept valid types', () => {
      expect(validateCategoryType('income')).toEqual({ isValid: true })
      expect(validateCategoryType('expense')).toEqual({ isValid: true })
      expect(validateCategoryType('both')).toEqual({ isValid: true })
    })

    it('should reject invalid types', () => {
      const result = validateCategoryType('invalid')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('income、expense 或 both')
    })
  })

  describe('validateTransaction', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date('2025-11-20'))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should validate complete valid transaction', () => {
      const result = validateTransaction({
        amount: 100,
        type: 'expense',
        categoryId: 'cat_food',
        date: '2025-11-20',
        note: 'Test note'
      })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should collect multiple validation errors', () => {
      const result = validateTransaction({
        amount: -50,
        type: 'invalid' as any,
        categoryId: '',
        date: 'invalid-date',
        note: 'A'.repeat(201)
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateCategory', () => {
    it('should validate complete valid category', () => {
      const result = validateCategory({
        name: '餐饮',
        type: 'expense',
        color: '#FF5733'
      })
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should collect multiple validation errors', () => {
      const result = validateCategory({
        name: '',
        type: 'invalid' as any,
        color: 'invalid-color'
      })
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })
})
