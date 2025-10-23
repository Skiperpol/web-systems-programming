import { ProductModel } from '../model/products.model.js';
import { ProductCreateData } from '../types/product-create-data.interface.js';

export interface ProductUpdateData {
  name?: string;
  price?: number;
  description?: string;
}

export abstract class IProductService {
  abstract create(data: ProductCreateData): Promise<ProductModel>;
  abstract findOne(id: string): Promise<ProductModel>;
  abstract findAll(): Promise<ProductModel[]>;
  abstract update(id: string, data: ProductUpdateData): Promise<ProductModel>;
  abstract updatePrice(id: string, newPrice: number): Promise<ProductModel>;
  abstract delete(id: string): Promise<void>;
}
