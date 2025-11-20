/**
 * Format number as Chinese Yuan (CNY) currency
 * @param amount - Amount to format
 * @returns Formatted string like ¥1,234.56
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse currency string to number
 * @param value - Currency string (e.g., "¥1,234.56" or "1234.56")
 * @returns Parsed number
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[¥,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Round amount to 2 decimal places (currency precision)
 * @param amount - Amount to round
 * @returns Rounded amount
 */
export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}
