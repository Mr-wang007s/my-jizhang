import { formatCurrency, parseCurrency, roundCurrency } from '../../src/utils/currency';

describe('Currency Utilities', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers as CNY', () => {
      expect(formatCurrency(1234.56)).toBe('¥1,234.56');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('¥0.00');
    });

    it('should format numbers with 2 decimal places', () => {
      expect(formatCurrency(100)).toBe('¥100.00');
    });

    it('should format large numbers with commas', () => {
      expect(formatCurrency(1234567.89)).toBe('¥1,234,567.89');
    });

    it('should round to 2 decimal places', () => {
      expect(formatCurrency(100.556)).toBe('¥100.56');
      expect(formatCurrency(100.554)).toBe('¥100.55');
    });
  });

  describe('parseCurrency', () => {
    it('should parse formatted currency strings', () => {
      expect(parseCurrency('¥1,234.56')).toBe(1234.56);
    });

    it('should parse plain number strings', () => {
      expect(parseCurrency('1234.56')).toBe(1234.56);
    });

    it('should handle strings with only currency symbol', () => {
      expect(parseCurrency('¥100')).toBe(100);
    });

    it('should return 0 for invalid strings', () => {
      expect(parseCurrency('invalid')).toBe(0);
      expect(parseCurrency('')).toBe(0);
    });
  });

  describe('roundCurrency', () => {
    it('should round to 2 decimal places', () => {
      expect(roundCurrency(100.556)).toBe(100.56);
      expect(roundCurrency(100.554)).toBe(100.55);
      expect(roundCurrency(100.555)).toBe(100.56);
    });

    it('should handle integers', () => {
      expect(roundCurrency(100)).toBe(100);
    });

    it('should handle negative numbers', () => {
      expect(roundCurrency(-50.556)).toBe(-50.56);
    });
  });
});
