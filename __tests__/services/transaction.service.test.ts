import { TransactionService } from '../../src/services/transaction.service';
import { CategoryService } from '../../src/services/category.service';
import type { CreateTransactionInput } from '../../src/types';
import { ValidationError } from '../../src/types';

// Mock Taro
jest.mock('@tarojs/taro');

describe('TransactionService', () => {
  let testCategoryId: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Initialize categories and get a test category ID
    const categories = await CategoryService.initializeDefaults();
    testCategoryId = categories[0]._id;
  });

  describe('create', () => {
    it('should create a valid transaction', async () => {
      const input: CreateTransactionInput = {
        amount: 100.50,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
        note: '午餐',
      };

      const transaction = await TransactionService.create(input);

      expect(transaction).toBeDefined();
      expect(transaction._id).toBeDefined();
      expect(transaction.amount).toBe(100.50);
      expect(transaction.type).toBe('expense');
      expect(transaction.categoryId).toBe(testCategoryId);
      expect(transaction.date).toBe('2025-11-20');
      expect(transaction.note).toBe('午餐');
      expect(transaction.createdAt).toBeDefined();
      expect(transaction.updatedAt).toBeDefined();
    });

    it('should reject negative amounts', async () => {
      const input: CreateTransactionInput = {
        amount: -50,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
      };

      await expect(TransactionService.create(input)).rejects.toThrow(ValidationError);
    });

    it('should reject amounts with more than 2 decimal places', async () => {
      const input: CreateTransactionInput = {
        amount: 100.556,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
      };

      await expect(TransactionService.create(input)).rejects.toThrow(ValidationError);
    });

    it('should reject invalid dates', async () => {
      const input: CreateTransactionInput = {
        amount: 100,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2030-01-01', // Too far in future
      };

      await expect(TransactionService.create(input)).rejects.toThrow(ValidationError);
    });

    it('should reject empty category ID', async () => {
      const input: CreateTransactionInput = {
        amount: 100,
        type: 'expense',
        categoryId: '',
        date: '2025-11-20',
      };

      await expect(TransactionService.create(input)).rejects.toThrow(ValidationError);
    });

    it('should accept transactions without notes', async () => {
      const input: CreateTransactionInput = {
        amount: 100,
        type: 'income',
        categoryId: testCategoryId,
        date: '2025-11-20',
      };

      const transaction = await TransactionService.create(input);
      expect(transaction).toBeDefined();
      expect(transaction.note).toBeUndefined();
    });
  });

  describe('list', () => {
    beforeEach(async () => {
      // Create some test transactions
      await TransactionService.create({
        amount: 50,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
      });
      await TransactionService.create({
        amount: 3000,
        type: 'income',
        categoryId: testCategoryId,
        date: '2025-11-19',
      });
    });

    it('should list all transactions', async () => {
      const result = await TransactionService.list();

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.total).toBeGreaterThan(0);
    });

    it('should paginate results', async () => {
      const result = await TransactionService.list({ limit: 1, offset: 0 });

      expect(result.data).toHaveLength(1);
      expect(result.hasMore).toBe(true);
    });

    it('should filter by type', async () => {
      const result = await TransactionService.list({ type: 'expense' });

      expect(result.data.every((t) => t.type === 'expense')).toBe(true);
    });

    it('should sort by date descending by default', async () => {
      const result = await TransactionService.list();

      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].date <= result.data[i - 1].date).toBe(true);
      }
    });
  });

  describe('update', () => {
    it('should update transaction fields', async () => {
      const transaction = await TransactionService.create({
        amount: 100,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
      });

      const updated = await TransactionService.update(transaction._id, {
        amount: 150,
        note: '更新备注',
      });

      expect(updated.amount).toBe(150);
      expect(updated.note).toBe('更新备注');
      expect(updated.updatedAt).not.toBe(transaction.updatedAt);
    });

    it('should validate updated amount', async () => {
      const transaction = await TransactionService.create({
        amount: 100,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
      });

      await expect(
        TransactionService.update(transaction._id, { amount: -50 })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('delete', () => {
    it('should delete a transaction', async () => {
      const transaction = await TransactionService.create({
        amount: 100,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
      });

      await TransactionService.delete(transaction._id);

      const found = await TransactionService.getById(transaction._id);
      expect(found).toBeNull();
    });
  });

  describe('getById', () => {
    it('should return transaction by ID', async () => {
      const transaction = await TransactionService.create({
        amount: 100,
        type: 'expense',
        categoryId: testCategoryId,
        date: '2025-11-20',
      });

      const found = await TransactionService.getById(transaction._id);

      expect(found).toBeDefined();
      expect(found?._id).toBe(transaction._id);
    });

    it('should return null for non-existent ID', async () => {
      const found = await TransactionService.getById('non-existent');
      expect(found).toBeNull();
    });
  });
});
