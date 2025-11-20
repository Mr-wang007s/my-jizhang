import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Extend dayjs with plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Format date to YYYY-MM-DD
 * @param date - Date to format (Date, Dayjs, or ISO string)
 * @returns Formatted date string
 */
export function formatDate(date: Date | Dayjs | string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

/**
 * Format date to YYYY-MM
 * @param date - Date to format
 * @returns Formatted month string
 */
export function formatMonth(date: Date | Dayjs | string): string {
  return dayjs(date).format('YYYY-MM');
}

/**
 * Get start of month
 * @param date - Date (defaults to today)
 * @returns Start of month as ISO string (YYYY-MM-DD)
 */
export function getStartOfMonth(date?: Date | Dayjs | string): string {
  return dayjs(date).startOf('month').format('YYYY-MM-DD');
}

/**
 * Get end of month
 * @param date - Date (defaults to today)
 * @returns End of month as ISO string (YYYY-MM-DD)
 */
export function getEndOfMonth(date?: Date | Dayjs | string): string {
  return dayjs(date).endOf('month').format('YYYY-MM-DD');
}

/**
 * Get today's date
 * @returns Today as YYYY-MM-DD
 */
export function getToday(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * Get current month
 * @returns Current month as YYYY-MM
 */
export function getCurrentMonth(): string {
  return dayjs().format('YYYY-MM');
}

/**
 * Check if date is within allowed range
 * @param date - Date to check
 * @param maxPastYears - Maximum years in the past (default: 10)
 * @param maxFutureDays - Maximum days in the future (default: 7)
 * @returns True if valid
 */
export function isDateInRange(
  date: string,
  maxPastYears = 10,
  maxFutureDays = 7
): boolean {
  const d = dayjs(date);
  const minDate = dayjs().subtract(maxPastYears, 'years');
  const maxDate = dayjs().add(maxFutureDays, 'days');

  return d.isSameOrAfter(minDate) && d.isSameOrBefore(maxDate);
}

/**
 * Get date range for last N months
 * @param months - Number of months
 * @returns { start, end } date range
 */
export function getLastNMonths(months: number): { start: string; end: string } {
  return {
    start: dayjs().subtract(months, 'months').startOf('month').format('YYYY-MM-DD'),
    end: dayjs().endOf('month').format('YYYY-MM-DD'),
  };
}

/**
 * Get date range for current year
 * @returns { start, end } date range
 */
export function getCurrentYear(): { start: string; end: string } {
  return {
    start: dayjs().startOf('year').format('YYYY-MM-DD'),
    end: dayjs().endOf('year').format('YYYY-MM-DD'),
  };
}

/**
 * Parse month string to year and month
 * @param monthStr - Month string (YYYY-MM)
 * @returns { year, month }
 */
export function parseMonth(monthStr: string): { year: number; month: number } {
  const [year, month] = monthStr.split('-').map(Number);
  return { year, month };
}

/**
 * Get ISO timestamp (for createdAt/updatedAt)
 * @returns Current time as ISO string
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}
