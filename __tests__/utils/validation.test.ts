import {
  validateAmount,
  validateDate,
  validateCategoryId,
  validateNote,
  validateCategoryName,
  validateColor,
  validateType,
} from '../../src/utils/validation';

describe('Validation Utilities', () => {
  describe('validateAmount', () => {
    it('should accept valid positive amounts', () => {
      expect(validateAmount(100)).toEqual({ valid: true });
      expect(validateAmount(100.5)).toEqual({ valid: true });
      expect(validateAmount(100.56)).toEqual({ valid: true });
    });

    it('should reject zero and negative amounts', () => {
      expect(validateAmount(0)).toEqual({ valid: false, error: '金额必须大于0' });
      expect(validateAmount(-50)).toEqual({ valid: false, error: '金额必须大于0' });
    });

    it('should reject amounts with more than 2 decimal places', () => {
      const result = validateAmount(100.556);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('金额最多保留2位小数');
    });

    it('should reject amounts exceeding maximum', () => {
      const result = validateAmount(1000000000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('金额超出最大限制');
    });

    it('should reject non-number values', () => {
      expect(validateAmount(NaN)).toEqual({ valid: false, error: '金额必须是数字' });
    });
  });

  describe('validateDate', () => {
    it('should accept valid dates', () => {
      expect(validateDate('2025-11-20')).toEqual({ valid: true });
    });

    it('should reject empty dates', () => {
      expect(validateDate('')).toEqual({ valid: false, error: '日期不能为空' });
    });

    it('should reject invalid date formats', () => {
      expect(validateDate('2025/11/20')).toEqual({
        valid: false,
        error: '日期格式必须为 YYYY-MM-DD',
      });
      expect(validateDate('20-11-2025')).toEqual({
        valid: false,
        error: '日期格式必须为 YYYY-MM-DD',
      });
    });

    it('should reject invalid dates', () => {
      expect(validateDate('2025-13-45')).toEqual({ valid: false, error: '无效的日期' });
    });

    it('should reject dates outside allowed range', () => {
      const farFuture = '2030-01-01';
      const result = validateDate(farFuture);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('日期超出允许范围');
    });
  });

  describe('validateCategoryId', () => {
    it('should accept valid category IDs', () => {
      expect(validateCategoryId('cat_food')).toEqual({ valid: true });
    });

    it('should reject empty category IDs', () => {
      expect(validateCategoryId('')).toEqual({ valid: false, error: '分类不能为空' });
      expect(validateCategoryId('   ')).toEqual({ valid: false, error: '分类不能为空' });
    });
  });

  describe('validateNote', () => {
    it('should accept valid notes', () => {
      expect(validateNote('午餐')).toEqual({ valid: true });
      expect(validateNote()).toEqual({ valid: true }); // Optional
    });

    it('should reject notes exceeding 200 characters', () => {
      const longNote = 'a'.repeat(201);
      const result = validateNote(longNote);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('备注不能超过200个字符');
    });
  });

  describe('validateCategoryName', () => {
    it('should accept valid category names', () => {
      expect(validateCategoryName('餐饮')).toEqual({ valid: true });
    });

    it('should reject empty names', () => {
      expect(validateCategoryName('')).toEqual({ valid: false, error: '分类名称不能为空' });
      expect(validateCategoryName('   ')).toEqual({
        valid: false,
        error: '分类名称不能为空',
      });
    });

    it('should reject names exceeding 20 characters', () => {
      const longName = 'a'.repeat(21);
      const result = validateCategoryName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('分类名称不能超过20个字符');
    });
  });

  describe('validateColor', () => {
    it('should accept valid hex colors', () => {
      expect(validateColor('#FF5733')).toEqual({ valid: true });
      expect(validateColor('#000000')).toEqual({ valid: true });
      expect(validateColor()).toEqual({ valid: true }); // Optional
    });

    it('should reject invalid hex colors', () => {
      expect(validateColor('#FF573')).toEqual({
        valid: false,
        error: '颜色必须是有效的十六进制格式 (如 #FF5733)',
      });
      expect(validateColor('FF5733')).toEqual({
        valid: false,
        error: '颜色必须是有效的十六进制格式 (如 #FF5733)',
      });
      expect(validateColor('#GGGGGG')).toEqual({
        valid: false,
        error: '颜色必须是有效的十六进制格式 (如 #FF5733)',
      });
    });
  });

  describe('validateType', () => {
    it('should accept valid types', () => {
      expect(validateType('income')).toEqual({ valid: true });
      expect(validateType('expense')).toEqual({ valid: true });
    });

    it('should reject invalid types', () => {
      expect(validateType('invalid')).toEqual({
        valid: false,
        error: '类型必须是 income 或 expense',
      });
    });
  });
});
