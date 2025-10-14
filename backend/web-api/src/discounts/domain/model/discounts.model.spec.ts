import { DiscountModel } from './discounts.model';

describe('DiscountModel', () => {
  let discount: DiscountModel;
  let validFrom: Date;
  let validTo: Date;

  beforeEach(() => {
    validFrom = new Date('2024-01-01');
    validTo = new Date('2024-12-31');
    discount = new DiscountModel(
      'test-id',
      'Test Discount',
      15,
      'Test Description',
      validFrom,
      validTo,
    );
  });

  describe('constructor', () => {
    it('should create a discount with correct properties', () => {
      expect(discount.id).toBe('test-id');
      expect(discount.name).toBe('Test Discount');
      expect(discount.percentage).toBe(15);
      expect(discount.description).toBe('Test Description');
      expect(discount.validFrom).toBe(validFrom);
      expect(discount.validTo).toBe(validTo);
    });
  });

  describe('updatePercentage', () => {
    it('should update percentage when new percentage is between 0 and 100', () => {
      const newPercentage = 25;
      discount.updatePercentage(newPercentage);
      expect(discount.percentage).toBe(newPercentage);
    });

    it('should allow 0% discount', () => {
      discount.updatePercentage(0);
      expect(discount.percentage).toBe(0);
    });

    it('should allow 100% discount', () => {
      discount.updatePercentage(100);
      expect(discount.percentage).toBe(100);
    });

    it('should throw error when percentage is negative', () => {
      expect(() => discount.updatePercentage(-5)).toThrow(
        'Percentage must be between 0 and 100.',
      );
      expect(discount.percentage).toBe(15); // Original percentage unchanged
    });

    it('should throw error when percentage is greater than 100', () => {
      expect(() => discount.updatePercentage(101)).toThrow(
        'Percentage must be between 0 and 100.',
      );
      expect(discount.percentage).toBe(15); // Original percentage unchanged
    });

    it('should throw error when percentage is 100.1', () => {
      expect(() => discount.updatePercentage(100.1)).toThrow(
        'Percentage must be between 0 and 100.',
      );
      expect(discount.percentage).toBe(15); // Original percentage unchanged
    });
  });

  describe('isActive', () => {
    beforeEach(() => {
      // Mock current date to be in the middle of the validity period
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-06-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true when current date is within validity period', () => {
      expect(discount.isActive()).toBe(true);
    });

    it('should return false when current date is before validity period', () => {
      jest.setSystemTime(new Date('2023-12-31'));
      expect(discount.isActive()).toBe(false);
    });

    it('should return false when current date is after validity period', () => {
      jest.setSystemTime(new Date('2025-01-01'));
      expect(discount.isActive()).toBe(false);
    });

    it('should return true when current date is exactly validFrom', () => {
      jest.setSystemTime(validFrom);
      expect(discount.isActive()).toBe(true);
    });

    it('should return true when current date is exactly validTo', () => {
      jest.setSystemTime(validTo);
      expect(discount.isActive()).toBe(true);
    });
  });
});
