/**
 * Unit tests for date utilities
 */

import {
  formatDate,
  formatDateChinese,
  formatMonth,
  getStartOfMonth,
  getEndOfMonth,
  getCurrentMonthRange,
  getMonthRange,
  getLastNMonthsRange,
  getCurrentYearRange,
  isDateInAllowedRange,
  isDateInFuture,
  getToday,
  parseDate,
  getRelativeTime
} from '@/utils/date'

describe('Date Utilities', () => {
  // Mock current date for consistent testing
  const mockToday = '2025-11-20'
  
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(mockToday))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      expect(formatDate(new Date('2025-11-20'))).toBe('2025-11-20')
      expect(formatDate('2025-11-20')).toBe('2025-11-20')
    })

    it('should use current date when no argument provided', () => {
      expect(formatDate()).toBe(mockToday)
    })
  })

  describe('formatDateChinese', () => {
    it('should format date in Chinese format', () => {
      expect(formatDateChinese('2025-11-20')).toBe('2025年11月20日')
    })
  })

  describe('formatMonth', () => {
    it('should format date to YYYY-MM', () => {
      expect(formatMonth('2025-11-20')).toBe('2025-11')
    })

    it('should use current month when no argument provided', () => {
      expect(formatMonth()).toBe('2025-11')
    })
  })

  describe('getStartOfMonth', () => {
    it('should return start of month', () => {
      expect(getStartOfMonth('2025-11-20')).toBe('2025-11-01')
      expect(getStartOfMonth('2025-02-28')).toBe('2025-02-01')
    })

    it('should use current month when no argument provided', () => {
      expect(getStartOfMonth()).toBe('2025-11-01')
    })
  })

  describe('getEndOfMonth', () => {
    it('should return end of month', () => {
      expect(getEndOfMonth('2025-11-20')).toBe('2025-11-30')
      expect(getEndOfMonth('2025-02-15')).toBe('2025-02-28')
    })

    it('should handle leap years', () => {
      expect(getEndOfMonth('2024-02-15')).toBe('2024-02-29')
    })
  })

  describe('getCurrentMonthRange', () => {
    it('should return current month range', () => {
      const range = getCurrentMonthRange()
      expect(range.start).toBe('2025-11-01')
      expect(range.end).toBe('2025-11-30')
    })
  })

  describe('getMonthRange', () => {
    it('should return month range for specific year and month', () => {
      const range = getMonthRange(2025, 11)
      expect(range.start).toBe('2025-11-01')
      expect(range.end).toBe('2025-11-30')
    })

    it('should handle single-digit months', () => {
      const range = getMonthRange(2025, 3)
      expect(range.start).toBe('2025-03-01')
      expect(range.end).toBe('2025-03-31')
    })
  })

  describe('getLastNMonthsRange', () => {
    it('should return range for last N months', () => {
      const range = getLastNMonthsRange(3)
      expect(range.start).toBe('2025-08-01')
      expect(range.end).toBe('2025-11-30')
    })

    it('should handle cross-year ranges', () => {
      jest.setSystemTime(new Date('2025-02-15'))
      const range = getLastNMonthsRange(6)
      expect(range.start).toBe('2024-08-01')
      expect(range.end).toBe('2025-02-28')
      jest.setSystemTime(new Date(mockToday))
    })
  })

  describe('getCurrentYearRange', () => {
    it('should return current year range', () => {
      const range = getCurrentYearRange()
      expect(range.start).toBe('2025-01-01')
      expect(range.end).toBe('2025-12-31')
    })
  })

  describe('isDateInAllowedRange', () => {
    it('should allow dates within valid range', () => {
      expect(isDateInAllowedRange('2025-11-20')).toBe(true)
      expect(isDateInAllowedRange('2025-11-25')).toBe(true) // 5 days in future
      expect(isDateInAllowedRange('2020-01-01')).toBe(true) // 5 years ago
    })

    it('should reject dates too far in the past', () => {
      expect(isDateInAllowedRange('2014-01-01')).toBe(false) // > 10 years ago
    })

    it('should reject dates too far in the future', () => {
      expect(isDateInAllowedRange('2025-12-01')).toBe(false) // > 7 days in future
    })
  })

  describe('isDateInFuture', () => {
    it('should detect future dates', () => {
      expect(isDateInFuture('2025-11-21')).toBe(true)
      expect(isDateInFuture('2026-01-01')).toBe(true)
    })

    it('should return false for today and past dates', () => {
      expect(isDateInFuture('2025-11-20')).toBe(false)
      expect(isDateInFuture('2025-11-19')).toBe(false)
    })
  })

  describe('getToday', () => {
    it('should return today in YYYY-MM-DD format', () => {
      expect(getToday()).toBe('2025-11-20')
    })
  })

  describe('parseDate', () => {
    it('should parse valid date strings', () => {
      const parsed = parseDate('2025-11-20')
      expect(parsed).not.toBeNull()
      expect(parsed?.format('YYYY-MM-DD')).toBe('2025-11-20')
    })

    it('should return null for invalid dates', () => {
      expect(parseDate('invalid')).toBeNull()
      // Note: dayjs may parse invalid dates like '2025-13-40', so we test with truly invalid string
    })
  })

  describe('getRelativeTime', () => {
    it('should return relative time for dates in the past', () => {
      expect(getRelativeTime('2025-11-18')).toBe('2天前')
    })

    it('should return time for recent hours', () => {
      const result = getRelativeTime('2025-11-19 20:00:00')
      expect(result).toContain('小时前')
    })
  })
})
