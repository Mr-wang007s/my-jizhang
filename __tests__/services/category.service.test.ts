import { CategoryService } from '../../src/services/category.service';
import type { Category } from '../../src/types';

// Mock Taro
jest.mock('@tarojs/taro');

describe('CategoryService', () => {
  beforeEach(() => {
    // Clear storage before each test
    jest.clearAllMocks();
  });

  describe('initializeDefaults', () => {
    it('should create 12 default categories', async () => {
      const categories = await CategoryService.initializeDefaults();

      expect(categories).toHaveLength(12);
      expect(categories.every((cat) => cat.isDefault)).toBe(true);
    });

    it('should include expected default categories', async () => {
      const categories = await CategoryService.initializeDefaults();

      const names = categories.map((cat) => cat.name);
      expect(names).toContain('工资');
      expect(names).toContain('奖金');
      expect(names).toContain('投资收益');
      expect(names).toContain('餐饮');
      expect(names).toContain('交通');
      expect(names).toContain('购物');
      expect(names).toContain('水电费');
      expect(names).toContain('娱乐');
      expect(names).toContain('医疗');
      expect(names).toContain('教育');
      expect(names).toContain('住房');
      expect(names).toContain('其他');
    });

    it('should assign correct types to categories', async () => {
      const categories = await CategoryService.initializeDefaults();

      const incomeCategories = categories.filter((cat) => cat.type === 'income');
      const expenseCategories = categories.filter((cat) => cat.type === 'expense');

      expect(incomeCategories.length).toBeGreaterThan(0);
      expect(expenseCategories.length).toBeGreaterThan(0);
    });

    it('should assign order numbers to categories', async () => {
      const categories = await CategoryService.initializeDefaults();

      categories.forEach((cat) => {
        expect(typeof cat.order).toBe('number');
        expect(cat.order).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('list', () => {
    it('should return all categories', async () => {
      await CategoryService.initializeDefaults();
      const categories = await CategoryService.list();

      expect(categories).toHaveLength(12);
    });

    it('should filter categories by type', async () => {
      await CategoryService.initializeDefaults();

      const incomeCategories = await CategoryService.list('income');
      const expenseCategories = await CategoryService.list('expense');

      expect(incomeCategories.every((cat) => cat.type === 'income')).toBe(true);
      expect(expenseCategories.every((cat) => cat.type === 'expense')).toBe(true);
    });

    it('should return categories sorted by order', async () => {
      await CategoryService.initializeDefaults();
      const categories = await CategoryService.list();

      for (let i = 1; i < categories.length; i++) {
        expect(categories[i].order).toBeGreaterThanOrEqual(categories[i - 1].order);
      }
    });
  });

  describe('getById', () => {
    it('should return category by ID', async () => {
      const categories = await CategoryService.initializeDefaults();
      const firstCategory = categories[0];

      const found = await CategoryService.getById(firstCategory._id);

      expect(found).toBeDefined();
      expect(found?._id).toBe(firstCategory._id);
      expect(found?.name).toBe(firstCategory.name);
    });

    it('should return null for non-existent ID', async () => {
      const found = await CategoryService.getById('non-existent-id');
      expect(found).toBeNull();
    });
  });
});
