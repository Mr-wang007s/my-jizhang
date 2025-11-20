import dayjs from 'dayjs';
import {
  formatDate,
  formatMonth,
  getStartOfMonth,
  getEndOfMonth,
  getToday,
  getCurrentMonth,
  isDateInRange,
  getLastNMonths,
  getCurrentYear,
  parseMonth,
  getTimestamp,
} from '../../src/utils/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2025-11-20');
      expect(formatDate(date)).toBe('2025-11-20');
    });

    it('should handle dayjs objects', () => {
      const date = dayjs('2025-11-20');
      expect(formatDate(date)).toBe('2025-11-20');
    });

    it('should handle ISO strings', () => {
      expect(formatDate('2025-11-20T12:00:00Z')).toBe('2025-11-20');
    });
  });

  describe('formatMonth', () => {
    it('should format date to YYYY-MM', () => {
      expect(formatMonth('2025-11-20')).toBe('2025-11');
    });
  });

  describe('getStartOfMonth', () => {
    it('should return start of month', () => {
      const result = getStartOfMonth('2025-11-20');
      expect(result).toBe('2025-11-01');
    });
  });

  describe('getEndOfMonth', () => {
    it('should return end of month', () => {
      const result = getEndOfMonth('2025-11-20');
      expect(result).toBe('2025-11-30');
    });

    it('should handle February correctly', () => {
      const result = getEndOfMonth('2025-02-15');
      expect(result).toBe('2025-02-28');
    });
  });

  describe('getToday', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const today = dayjs().format('YYYY-MM-DD');
      expect(getToday()).toBe(today);
    });
  });

  describe('getCurrentMonth', () => {
    it('should return current month in YYYY-MM format', () => {
      const month = dayjs().format('YYYY-MM');
      expect(getCurrentMonth()).toBe(month);
    });
  });

  describe('isDateInRange', () => {
    it('should accept dates within default range', () => {
      const today = getToday();
      expect(isDateInRange(today)).toBe(true);
    });

    it('should accept dates up to 7 days in future', () => {
      const futureDate = dayjs().add(5, 'days').format('YYYY-MM-DD');
      expect(isDateInRange(futureDate)).toBe(true);
    });

    it('should reject dates more than 7 days in future', () => {
      const futureDate = dayjs().add(10, 'days').format('YYYY-MM-DD');
      expect(isDateInRange(futureDate)).toBe(false);
    });

    it('should accept dates within 10 years in past', () => {
      const pastDate = dayjs().subtract(5, 'years').format('YYYY-MM-DD');
      expect(isDateInRange(pastDate)).toBe(true);
    });

    it('should reject dates more than 10 years in past', () => {
      const pastDate = dayjs().subtract(11, 'years').format('YYYY-MM-DD');
      expect(isDateInRange(pastDate)).toBe(false);
    });
  });

  describe('getLastNMonths', () => {
    it('should return date range for last 3 months', () => {
      const range = getLastNMonths(3);
      const expectedStart = dayjs()
        .subtract(3, 'months')
        .startOf('month')
        .format('YYYY-MM-DD');
      const expectedEnd = dayjs().endOf('month').format('YYYY-MM-DD');

      expect(range.start).toBe(expectedStart);
      expect(range.end).toBe(expectedEnd);
    });
  });

  describe('getCurrentYear', () => {
    it('should return date range for current year', () => {
      const range = getCurrentYear();
      const year = dayjs().year();

      expect(range.start).toBe(`${year}-01-01`);
      expect(range.end.startsWith(`${year}-12-`)).toBe(true);
    });
  });

  describe('parseMonth', () => {
    it('should parse month string to year and month', () => {
      const result = parseMonth('2025-11');
      expect(result).toEqual({ year: 2025, month: 11 });
    });
  });

  describe('getTimestamp', () => {
    it('should return ISO timestamp', () => {
      const timestamp = getTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });
});
