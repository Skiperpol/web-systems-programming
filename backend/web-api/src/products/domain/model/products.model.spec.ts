import { ProductModel } from './products.model.js';

describe('ProductModel', () => {
  let product: ProductModel;

  beforeEach(() => {
    product = new ProductModel(
      'test-id',
      'Test Product',
      99.99,
      'Test Description',
    );
  });

  describe('constructor', () => {
    it('should create a product with correct properties', () => {
      expect(product.id).toBe('test-id');
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(99.99);
      expect(product.description).toBe('Test Description');
    });
  });

  describe('updatePrice', () => {
    it('should update price when new price is positive', () => {
      const newPrice = 149.99;
      product.updatePrice(newPrice);
      expect(product.price).toBe(newPrice);
    });

    it('should throw error when price is zero', () => {
      expect(() => product.updatePrice(0)).toThrow('Price must be positive.');
      expect(product.price).toBe(99.99); // Original price unchanged
    });

    it('should throw error when price is negative', () => {
      expect(() => product.updatePrice(-10)).toThrow('Price must be positive.');
      expect(product.price).toBe(99.99); // Original price unchanged
    });

    it('should throw error when price is very small negative number', () => {
      expect(() => product.updatePrice(-0.01)).toThrow(
        'Price must be positive.',
      );
      expect(product.price).toBe(99.99); // Original price unchanged
    });
  });
});
