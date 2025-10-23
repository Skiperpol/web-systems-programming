import { ProductModel } from '../model/products.model.js';

export abstract class IProductRepository {
  abstract save(product: ProductModel): Promise<ProductModel>;
  abstract findById(id: string): Promise<ProductModel | null>;
  abstract findAll(): Promise<ProductModel[]>;
  abstract delete(id: string): Promise<void>;
}
