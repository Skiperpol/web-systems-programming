// discounts/adapters/persistence/discount-typeorm.repository.ts

import { IDiscountRepository } from '../../domain/ports/i-discounts.repository';
import { DiscountModel } from '../../domain/model/discounts.model';
import { DiscountTypeOrmEntity } from './discount.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountTypeOrmRepository implements IDiscountRepository {
  constructor(
    @InjectRepository(DiscountTypeOrmEntity)
    private readonly repository: Repository<DiscountTypeOrmEntity>,
  ) {}

  private toDomain(entity: DiscountTypeOrmEntity): DiscountModel {
    return new DiscountModel(
      entity.id,
      entity.name,
      entity.percentage,
      entity.description,
      entity.validFrom,
      entity.validTo,
    );
  }

  private toPersistence(model: DiscountModel): DiscountTypeOrmEntity {
    const entity = new DiscountTypeOrmEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.percentage = model.percentage;
    entity.description = model.description;
    entity.validFrom = model.validFrom;
    entity.validTo = model.validTo;
    return entity;
  }

  async save(discount: DiscountModel): Promise<DiscountModel> {
    const entity = this.toPersistence(discount);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<DiscountModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<DiscountModel[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.repository.clear();
  }
}
