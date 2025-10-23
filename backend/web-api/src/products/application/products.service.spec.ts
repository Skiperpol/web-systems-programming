import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from './products.service.js';
import { IProductRepository } from '../domain/ports/i-products.repository.js';
import { ProductModel } from '../domain/model/products.model.js';

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<IProductRepository>;

  const mockProduct = new ProductModel(
    'test-id',
    'Test Product',
    99.99,
    'Test Description',
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
        ProductService,
        {
          provide: IProductRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(IProductRepository);
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
      };

      repository.save.mockResolvedValue(mockProduct);

      const result = await service.create(productData);

      expect(result).toEqual(mockProduct);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          price: 99.99,
          description: 'Test Description',
        }),
      );
    });

    it('should generate a UUID for new product', async () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description',
      };

      repository.save.mockResolvedValue(mockProduct);

      await service.create(productData);

      const savedProduct = repository.save.mock.calls[0][0];
      expect(savedProduct.id).toBeDefined();
      expect(savedProduct.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      repository.findById.mockResolvedValue(mockProduct);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockProduct);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when product not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Product with ID non-existent-id not found',
      );
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [mockProduct];
      repository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(repository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no products exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('updatePrice', () => {
    it('should update product price', async () => {
      const updatedProduct = new ProductModel(
        'test-id',
        'Test Product',
        149.99,
        'Test Description',
      );

      repository.findById.mockResolvedValue(mockProduct);
      repository.save.mockResolvedValue(updatedProduct);

      const result = await service.updatePrice('test-id', 149.99);

      expect(result).toEqual(updatedProduct);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 149.99,
        }),
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updatePrice('non-existent-id', 149.99),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle domain validation errors', async () => {
      repository.findById.mockResolvedValue(mockProduct);

      await expect(service.updatePrice('test-id', -10)).rejects.toThrow(
        'Price must be positive.',
      );
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      repository.delete.mockResolvedValue(undefined);

      await service.delete('test-id');

      expect(repository.delete).toHaveBeenCalledWith('test-id');
    });
  });
});
