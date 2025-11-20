/**
 * Currency formatting utilities for CNY (Chinese Yuan)
 */

/**
 * Format a number as CNY currency with proper locale formatting
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "¥1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format currency without the symbol
 * @param amount - The amount to format
 * @returns Formatted number string (e.g., "1,234.56")
 */
export const formatCurrencyWithoutSymbol = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Parse a currency string to a number
 * @param currencyString - String to parse (e.g., "¥1,234.56" or "1234.56")
 * @returns Parsed number
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove currency symbol and commas
  const cleaned = currencyString.replace(/[¥,]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Round amount to 2 decimal places (for financial calculations)
 * @param amount - Amount to round
 * @returns Rounded amount
 */
export const roundToTwoDecimals = (amount: number): number => {
  return Math.round(amount * 100) / 100
}
