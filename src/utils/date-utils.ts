/**
 * Date/time utility functions
 * All dates are handled in ISO 8601 format
 */

/**
 * Get current date time in ISO 8601 format
 */
export function now(): string {
  return new Date().toISOString()
}

/**
 * Format date to ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export function toISOString(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString()
  }
  return date.toISOString()
}

/**
 * Format date to local date string (YYYY-MM-DD)
 */
export function toDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format date to display string (YYYY年MM月DD日)
 */
export function toDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}

/**
 * Format date to month string (YYYY-MM)
 */
export function toMonthString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Format date to display month (YYYY年MM月)
 */
export function toDisplayMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  return `${year}年${month}月`
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  d.setMonth(d.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Get date range for this month
 */
export function thisMonth(): { start: string; end: string } {
  const now = new Date()
  return {
    start: toISOString(startOfMonth(now)),
    end: toISOString(endOfMonth(now))
  }
}

/**
 * Get date range for last N days
 */
export function lastNDays(n: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - n + 1)
  return {
    start: toISOString(startOfDay(start)),
    end: toISOString(endOfDay(end))
  }
}

/**
 * Get date range for last N months
 */
export function lastNMonths(n: number): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - n + 1)
  return {
    start: toISOString(startOfMonth(start)),
    end: toISOString(endOfMonth(end))
  }
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return toDateString(d) === toDateString(today)
}

/**
 * Check if date is this month
 */
export function isThisMonth(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  return toMonthString(d) === toMonthString(today)
}

/**
 * Get relative time description (今天, 昨天, etc.)
 */
export function getRelativeDay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (toDateString(d) === toDateString(today)) {
    return '今天'
  } else if (toDateString(d) === toDateString(yesterday)) {
    return '昨天'
  } else {
    return toDisplayDate(d)
  }
}

/**
 * Parse ISO string to Date
 */
export function parseISO(isoString: string): Date {
  return new Date(isoString)
}

/**
 * Check if valid date
 */
export function isValidDate(date: any): boolean {
  if (date instanceof Date) {
    return !isNaN(date.getTime())
  }
  if (typeof date === 'string') {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }
  return false
}
