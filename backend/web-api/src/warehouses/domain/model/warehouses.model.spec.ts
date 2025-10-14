import { WarehouseModel } from './warehouses.model';

describe('WarehouseModel', () => {
  let warehouse: WarehouseModel;

  beforeEach(() => {
    warehouse = new WarehouseModel(
      'test-id',
      'Test Warehouse',
      'Test Address 123',
      1000,
    );
  });

  describe('constructor', () => {
    it('should create a warehouse with correct properties', () => {
      expect(warehouse.id).toBe('test-id');
      expect(warehouse.name).toBe('Test Warehouse');
      expect(warehouse.address).toBe('Test Address 123');
      expect(warehouse.capacity).toBe(1000);
    });
  });

  describe('updateCapacity', () => {
    it('should update capacity when new capacity is positive', () => {
      const newCapacity = 2000;
      warehouse.updateCapacity(newCapacity);
      expect(warehouse.capacity).toBe(newCapacity);
    });

    it('should throw error when capacity is zero', () => {
      expect(() => warehouse.updateCapacity(0)).toThrow(
        'Capacity must be positive.',
      );
      expect(warehouse.capacity).toBe(1000); // Original capacity unchanged
    });

    it('should throw error when capacity is negative', () => {
      expect(() => warehouse.updateCapacity(-100)).toThrow(
        'Capacity must be positive.',
      );
      expect(warehouse.capacity).toBe(1000); // Original capacity unchanged
    });

    it('should allow very small positive capacity', () => {
      const newCapacity = 0.1;
      warehouse.updateCapacity(newCapacity);
      expect(warehouse.capacity).toBe(newCapacity);
    });
  });
});
