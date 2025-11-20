/**
 * Unit tests for currency formatting utilities
 */

import { formatCurrency, formatCurrencyWithoutSymbol, parseCurrency, roundToTwoDecimals } from '@/utils/currency'

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('¥1,234.56')
      expect(formatCurrency(100)).toBe('¥100.00')
      expect(formatCurrency(0.5)).toBe('¥0.50')
    })

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('¥0.00')
    })

    it('should format negative numbers correctly', () => {
      expect(formatCurrency(-50.25)).toBe('-¥50.25')
    })

    it('should always show 2 decimal places', () => {
      expect(formatCurrency(100)).toBe('¥100.00')
      expect(formatCurrency(100.5)).toBe('¥100.50')
      expect(formatCurrency(100.123)).toBe('¥100.12')
    })

    it('should handle large numbers with thousands separators', () => {
      expect(formatCurrency(1234567.89)).toBe('¥1,234,567.89')
      expect(formatCurrency(1000000)).toBe('¥1,000,000.00')
    })
  })

  describe('formatCurrencyWithoutSymbol', () => {
    it('should format numbers without currency symbol', () => {
      expect(formatCurrencyWithoutSymbol(1234.56)).toBe('1,234.56')
      expect(formatCurrencyWithoutSymbol(100)).toBe('100.00')
    })

    it('should include thousands separators', () => {
      expect(formatCurrencyWithoutSymbol(1234567.89)).toBe('1,234,567.89')
    })
  })

  describe('parseCurrency', () => {
    it('should parse currency strings with symbol', () => {
      expect(parseCurrency('¥1,234.56')).toBe(1234.56)
      expect(parseCurrency('¥100.00')).toBe(100)
    })

    it('should parse currency strings without symbol', () => {
      expect(parseCurrency('1234.56')).toBe(1234.56)
      expect(parseCurrency('100')).toBe(100)
    })

    it('should handle strings with commas', () => {
      expect(parseCurrency('1,234,567.89')).toBe(1234567.89)
    })

    it('should return 0 for invalid strings', () => {
      expect(parseCurrency('invalid')).toBe(0)
      expect(parseCurrency('')).toBe(0)
    })

    it('should handle negative values', () => {
      expect(parseCurrency('-¥50.25')).toBe(-50.25)
    })
  })

  describe('roundToTwoDecimals', () => {
    it('should round to 2 decimal places', () => {
      expect(roundToTwoDecimals(100.123)).toBe(100.12)
      expect(roundToTwoDecimals(100.126)).toBe(100.13)
      expect(roundToTwoDecimals(100.125)).toBe(100.13)
    })

    it('should handle numbers with less than 2 decimals', () => {
      expect(roundToTwoDecimals(100)).toBe(100)
      expect(roundToTwoDecimals(100.5)).toBe(100.5)
    })

    it('should handle edge cases', () => {
      expect(roundToTwoDecimals(0.555)).toBe(0.56)
      expect(roundToTwoDecimals(0.005)).toBe(0.01)
    })

    it('should handle negative numbers', () => {
      expect(roundToTwoDecimals(-50.256)).toBe(-50.26)
      expect(roundToTwoDecimals(-50.251)).toBe(-50.25)
    })
  })
})
