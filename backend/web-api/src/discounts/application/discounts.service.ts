import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscountModel } from '../domain/model/discounts.model.js';
import { IDiscountRepository } from '../domain/ports/i-discounts.repository.js';
import {
  IDiscountService,
  DiscountUpdateData,
} from '../domain/ports/i-discounts.service.js';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';
import { DiscountCreateData } from '../domain/types/discount-create-data.interface.js';

@Injectable()
export class DiscountService implements IDiscountService {
  constructor(
    @Inject(IDiscountRepository)
    private readonly discountRepository: IDiscountRepository,
  ) {}

  async create(data: DiscountCreateData): Promise<DiscountModel> {
    const newDiscount = new DiscountModel(
      uuid(),
      data.name,
      data.percentage,
      data.description,
      data.validFrom,
      data.validTo,
    );

    return this.discountRepository.save(newDiscount);
  }

  async findOne(id: string): Promise<DiscountModel> {
    const discount = await this.discountRepository.findById(id);
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return discount;
  }

  async findAll(): Promise<DiscountModel[]> {
    return this.discountRepository.findAll();
  }

  async update(id: string, data: DiscountUpdateData): Promise<DiscountModel> {
    const discount = await this.findOne(id);

    if (data.name !== undefined) {
      discount.updateName(data.name);
    }
    if (data.percentage !== undefined) {
      discount.updatePercentage(data.percentage);
    }
    if (data.description !== undefined) {
      discount.updateDescription(data.description);
    }
    if (data.validFrom !== undefined) {
      discount.updateValidFrom(data.validFrom);
    }
    if (data.validTo !== undefined) {
      discount.updateValidTo(data.validTo);
    }

    return this.discountRepository.save(discount);
  }

  async updatePercentage(
    id: string,
    newPercentage: number,
  ): Promise<DiscountModel> {
    const discount = await this.findOne(id);

    discount.updatePercentage(newPercentage);

    return this.discountRepository.save(discount);
  }

  async delete(id: string): Promise<void> {
    await this.discountRepository.delete(id);
  }
}
