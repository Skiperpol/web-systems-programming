import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DiscountService } from './discounts.service.js';
import { IDiscountRepository } from '../domain/ports/i-discounts.repository.js';
import { DiscountModel } from '../domain/model/discounts.model.js';

describe('DiscountService', () => {
  let service: DiscountService;
  let repository: jest.Mocked<IDiscountRepository>;

  const validFrom = new Date('2024-01-01');
  const validTo = new Date('2024-12-31');
  const mockDiscount = new DiscountModel(
    'test-id',
    'Test Discount',
    15,
    'Test Description',
    validFrom,
    validTo,
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
        DiscountService,
        {
          provide: IDiscountRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DiscountService>(DiscountService);
    repository = module.get(IDiscountRepository);
  });

  describe('create', () => {
    it('should create a new discount', async () => {
      const discountData = {
        name: 'Test Discount',
        percentage: 15,
        description: 'Test Description',
        validFrom,
        validTo,
      };

      repository.save.mockResolvedValue(mockDiscount);

      const result = await service.create(discountData);

      expect(result).toEqual(mockDiscount);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Discount',
          percentage: 15,
          description: 'Test Description',
          validFrom,
          validTo,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a discount when found', async () => {
      repository.findById.mockResolvedValue(mockDiscount);

      const result = await service.findOne('test-id');

      expect(result).toEqual(mockDiscount);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw NotFoundException when discount not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Discount with ID non-existent-id not found',
      );
    });
  });

  describe('updatePercentage', () => {
    it('should update discount percentage', async () => {
      const updatedDiscount = new DiscountModel(
        'test-id',
        'Test Discount',
        25,
        'Test Description',
        validFrom,
        validTo,
      );

      repository.findById.mockResolvedValue(mockDiscount);
      repository.save.mockResolvedValue(updatedDiscount);

      const result = await service.updatePercentage('test-id', 25);

      expect(result).toEqual(updatedDiscount);
      expect(repository.findById).toHaveBeenCalledWith('test-id');
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          percentage: 25,
        }),
      );
    });

    it('should throw NotFoundException when discount not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updatePercentage('non-existent-id', 25),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle domain validation errors', async () => {
      repository.findById.mockResolvedValue(mockDiscount);

      await expect(service.updatePercentage('test-id', 150)).rejects.toThrow(
        'Percentage must be between 0 and 100.',
      );
    });
  });
});
