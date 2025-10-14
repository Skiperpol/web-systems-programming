import { ProductModel } from '../model/products.model';
import { ProductCreateData } from '../types/product-create-data.interface';

export abstract class IProductService {
  abstract create(data: ProductCreateData): Promise<ProductModel>;
  abstract findOne(id: string): Promise<ProductModel>;
  abstract findAll(): Promise<ProductModel[]>;
  abstract updatePrice(id: string, newPrice: number): Promise<ProductModel>;
  abstract delete(id: string): Promise<void>;
}
