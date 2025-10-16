import { DiscountModel } from '../model/discounts.model';
import { DiscountCreateData } from '../types/discount-create-data.interface';

export interface DiscountUpdateData {
  name?: string;
  percentage?: number;
  description?: string;
  validFrom?: Date;
  validTo?: Date;
}

export abstract class IDiscountService {
  abstract create(data: DiscountCreateData): Promise<DiscountModel>;
  abstract findOne(id: string): Promise<DiscountModel>;
  abstract findAll(): Promise<DiscountModel[]>;
  abstract update(id: string, data: DiscountUpdateData): Promise<DiscountModel>;
  abstract updatePercentage(
    id: string,
    newPercentage: number,
  ): Promise<DiscountModel>;
  abstract delete(id: string): Promise<void>;
}
