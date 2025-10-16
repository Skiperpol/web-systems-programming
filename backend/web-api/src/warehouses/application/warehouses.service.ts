import { Injectable, NotFoundException } from '@nestjs/common';
import { WarehouseModel } from '../domain/model/warehouses.model';
import { IWarehouseRepository } from '../domain/ports/i-warehouses.repository';
import { IWarehouseService, WarehouseUpdateData } from '../domain/ports/i-warehouses.service';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';
import { WarehouseCreateData } from '../domain/types/warehouse-create-data.interface';

@Injectable()
export class WarehouseService implements IWarehouseService {
  constructor(
    @Inject(IWarehouseRepository)
    private readonly warehouseRepository: IWarehouseRepository,
  ) {}

  async create(data: WarehouseCreateData): Promise<WarehouseModel> {
    const newWarehouse = new WarehouseModel(
      uuid(),
      data.name,
      data.address,
      data.capacity,
    );

    return this.warehouseRepository.save(newWarehouse);
  }

  async findOne(id: string): Promise<WarehouseModel> {
    const warehouse = await this.warehouseRepository.findById(id);
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async findAll(): Promise<WarehouseModel[]> {
    return this.warehouseRepository.findAll();
  }

  async update(id: string, data: WarehouseUpdateData): Promise<WarehouseModel> {
    const warehouse = await this.findOne(id);

    if (data.name !== undefined) {
      warehouse.updateName(data.name);
    }
    if (data.address !== undefined) {
      warehouse.updateAddress(data.address);
    }
    if (data.capacity !== undefined) {
      warehouse.updateCapacity(data.capacity);
    }

    return this.warehouseRepository.save(warehouse);
  }

  async updateCapacity(
    id: string,
    newCapacity: number,
  ): Promise<WarehouseModel> {
    const warehouse = await this.findOne(id);

    warehouse.updateCapacity(newCapacity);

    return this.warehouseRepository.save(warehouse);
  }

  async delete(id: string): Promise<void> {
    await this.warehouseRepository.delete(id);
  }
}
