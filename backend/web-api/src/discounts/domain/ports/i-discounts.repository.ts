import { DiscountModel } from '../model/discounts.model';

export abstract class IDiscountRepository {
  abstract save(discount: DiscountModel): Promise<DiscountModel>;
  abstract findById(id: string): Promise<DiscountModel | null>;
  abstract findAll(): Promise<DiscountModel[]>;
  abstract delete(id: string): Promise<void>;
}
