import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WarehouseService } from './warehouses.service.js';
import { IWarehouseRepository } from '../domain/ports/i-warehouses.repository.js';
import { WarehouseModel } from '../domain/model/warehouses.model.js';
import { WarehouseCreateData } from '../domain/types/warehouse-create-data.interface.js';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let repository: jest.Mocked<IWarehouseRepository>;

  const mockWarehouse = new WarehouseModel(
    'test-id',
    'Test Warehouse',
    'Test Address 123',
    1000,
  );

  beforeEach(async () => {
    const mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        {
          provide: IWarehouseRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
    repository = module.get(IWarehouseRepository);
  });

  describe('create', () => {
    it('should create a new warehouse', async () => {
      const warehouseData = {
        name: 'Test Warehouse',
        address: 'Test Address 123',
        capacity: 1000,
      } as WarehouseCreateData;

      repository.save.mockResolvedValue(mockWarehouse);

      const result = await service.create(warehouseData);

      expect(result).toEqual(mockWarehouse);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Warehouse',
          address: 'Test Address 123',
          capacity: 1000,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a warehouse when found', async () => {
      repository.findById.mockResolvedValue(mockWarehouse);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockWarehouse);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when warehouse not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Warehouse with ID non-existent-id not found',
      );
    });
  });

  describe('updateCapacity', () => {
    it('should update warehouse capacity', async () => {
      const updatedWarehouse = new WarehouseModel(
        'test-id',
        'Test Warehouse',
        'Test Address 123',
        2000,
      );

      repository.findById.mockResolvedValue(mockWarehouse);
      repository.save.mockResolvedValue(updatedWarehouse);

      const result = await service.updateCapacity('test-id', 2000);

      expect(result).toEqual(updatedWarehouse);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          capacity: 2000,
        }),
      );
    });

    it('should throw NotFoundException when warehouse not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateCapacity('non-existent-id', 2000),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle domain validation errors', async () => {
      repository.findById.mockResolvedValue(mockWarehouse);

      await expect(service.updateCapacity('test-id', -100)).rejects.toThrow(
        'Capacity must be positive.',
      );
    });
  });
});
