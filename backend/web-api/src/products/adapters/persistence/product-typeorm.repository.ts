// products/adapters/persistence/product-typeorm.repository.ts

import { IProductRepository } from '../../domain/ports/i-products.repository';
import { ProductModel } from '../../domain/model/products.model';
import { ProductTypeOrmEntity } from './product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly repository: Repository<ProductTypeOrmEntity>,
  ) {}

  private toDomain(entity: ProductTypeOrmEntity): ProductModel {
    return new ProductModel(
      entity.id,
      entity.name,
      entity.price,
      entity.description,
    );
  }

  private toPersistence(model: ProductModel): ProductTypeOrmEntity {
    const entity = new ProductTypeOrmEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.price = model.price;
    entity.description = model.description;
    return entity;
  }

  async save(product: ProductModel): Promise<ProductModel> {
    const entity = this.toPersistence(product);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<ProductModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<ProductModel[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
