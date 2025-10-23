// warehouses/adapters/persistence/warehouse-typeorm.repository.ts

import { IWarehouseRepository } from '../../domain/ports/i-warehouses.repository.js';
import { WarehouseModel } from '../../domain/model/warehouses.model.js';
import { WarehouseTypeOrmEntity } from './warehouse.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseTypeOrmRepository implements IWarehouseRepository {
  constructor(
    @InjectRepository(WarehouseTypeOrmEntity)
    private readonly repository: Repository<WarehouseTypeOrmEntity>,
  ) {}

  private toDomain(entity: WarehouseTypeOrmEntity): WarehouseModel {
    return new WarehouseModel(
      entity.id,
      entity.name,
      entity.address,
      entity.capacity,
    );
  }

  private toPersistence(model: WarehouseModel): WarehouseTypeOrmEntity {
    const entity = new WarehouseTypeOrmEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.address = model.address;
    entity.capacity = model.capacity;
    return entity;
  }

  async save(warehouse: WarehouseModel): Promise<WarehouseModel> {
    const entity = this.toPersistence(warehouse);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<WarehouseModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<WarehouseModel[]> {
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
