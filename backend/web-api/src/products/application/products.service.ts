import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductModel } from '../domain/model/products.model';
import { IProductRepository } from '../domain/ports/i-products.repository';
import { IProductService, ProductUpdateData } from '../domain/ports/i-products.service';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';
import { ProductCreateData } from '../domain/types/product-create-data.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async create(data: ProductCreateData): Promise<ProductModel> {
    const newProduct = new ProductModel(
      uuid(),
      data.name,
      data.price,
      data.description,
    );

    return this.productRepository.save(newProduct);
  }

  async findOne(id: string): Promise<ProductModel> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findAll(): Promise<ProductModel[]> {
    return this.productRepository.findAll();
  }

  async update(id: string, data: ProductUpdateData): Promise<ProductModel> {
    const product = await this.findOne(id);

    if (data.name !== undefined) {
      product.updateName(data.name);
    }
    if (data.price !== undefined) {
      product.updatePrice(data.price);
    }
    if (data.description !== undefined) {
      product.updateDescription(data.description);
    }

    return this.productRepository.save(product);
  }

  async updatePrice(id: string, newPrice: number): Promise<ProductModel> {
    const product = await this.findOne(id);

    product.updatePrice(newPrice);

    return this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
