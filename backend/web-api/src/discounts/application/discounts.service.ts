import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscountModel } from '../domain/model/discounts.model';
import { IDiscountRepository } from '../domain/ports/i-discounts.repository';
import { IDiscountService } from '../domain/ports/i-discounts.service';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';
import { DiscountCreateData } from '../domain/types/discount-create-data.interface';

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
