/**
 * Date utility functions using dayjs
 */

import dayjs, { Dayjs } from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'

// Enable plugins
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

/**
 * Format date to YYYY-MM-DD
 * @param date - Date to format (Date object, string, or Dayjs)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | Dayjs = new Date()): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * Format date to display format (YYYY年MM月DD日)
 * @param date - Date to format
 * @returns Chinese formatted date
 */
export const formatDateChinese = (date: Date | string | Dayjs): string => {
  return dayjs(date).format('YYYY年MM月DD日')
}

/**
 * Format date to month string (YYYY-MM)
 * @param date - Date to format
 * @returns Month string
 */
export const formatMonth = (date: Date | string | Dayjs = new Date()): string => {
  return dayjs(date).format('YYYY-MM')
}

/**
 * Get start of month
 * @param date - Reference date
 * @returns Start of month date string (YYYY-MM-DD)
 */
export const getStartOfMonth = (date: Date | string | Dayjs = new Date()): string => {
  return dayjs(date).startOf('month').format('YYYY-MM-DD')
}

/**
 * Get end of month
 * @param date - Reference date
 * @returns End of month date string (YYYY-MM-DD)
 */
export const getEndOfMonth = (date: Date | string | Dayjs = new Date()): string => {
  return dayjs(date).endOf('month').format('YYYY-MM-DD')
}

/**
 * Get current month range
 * @returns Object with start and end dates
 */
export const getCurrentMonthRange = (): { start: string; end: string } => {
  return {
    start: getStartOfMonth(),
    end: getEndOfMonth()
  }
}

/**
 * Get month range for a specific year and month
 * @param year - Year (e.g., 2025)
 * @param month - Month (1-12)
 * @returns Object with start and end dates
 */
export const getMonthRange = (year: number, month: number): { start: string; end: string } => {
  const date = dayjs(`${year}-${month.toString().padStart(2, '0')}-01`)
  return {
    start: date.startOf('month').format('YYYY-MM-DD'),
    end: date.endOf('month').format('YYYY-MM-DD')
  }
}

/**
 * Get date range for last N months
 * @param months - Number of months to go back
 * @returns Object with start and end dates
 */
export const getLastNMonthsRange = (months: number): { start: string; end: string } => {
  return {
    start: dayjs().subtract(months, 'month').startOf('month').format('YYYY-MM-DD'),
    end: getEndOfMonth()
  }
}

/**
 * Get current year range
 * @returns Object with start and end dates
 */
export const getCurrentYearRange = (): { start: string; end: string } => {
  return {
    start: dayjs().startOf('year').format('YYYY-MM-DD'),
    end: dayjs().endOf('year').format('YYYY-MM-DD')
  }
}

/**
 * Check if a date is within allowed range (not > 10 years old, not > 7 days in future)
 * @param date - Date to check
 * @returns True if valid
 */
export const isDateInAllowedRange = (date: string | Date): boolean => {
  const d = dayjs(date)
  const minDate = dayjs().subtract(10, 'years')
  const maxDate = dayjs().add(7, 'days')
  
  return d.isBetween(minDate, maxDate, null, '[]')
}

/**
 * Check if date is in the future (beyond today)
 * @param date - Date to check
 * @returns True if in future
 */
export const isDateInFuture = (date: string | Date): boolean => {
  return dayjs(date).isAfter(dayjs(), 'day')
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date
 */
export const getToday = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

/**
 * Parse date string in various formats
 * @param dateString - Date string to parse
 * @returns Dayjs object or null if invalid
 */
export const parseDate = (dateString: string): Dayjs | null => {
  const parsed = dayjs(dateString)
  return parsed.isValid() ? parsed : null
}

/**
 * Get relative time description (e.g., "2天前")
 * @param date - Date to describe
 * @returns Relative time string in Chinese
 */
export const getRelativeTime = (date: string | Date): string => {
  const d = dayjs(date)
  const now = dayjs()
  
  const diffDays = now.diff(d, 'day')
  const diffHours = now.diff(d, 'hour')
  const diffMinutes = now.diff(d, 'minute')
  
  if (diffDays > 0) {
    return `${diffDays}天前`
  } else if (diffHours > 0) {
    return `${diffHours}小时前`
  } else if (diffMinutes > 0) {
    return `${diffMinutes}分钟前`
  } else {
    return '刚刚'
  }
}
