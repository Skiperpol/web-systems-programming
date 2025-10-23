import { WarehouseModel } from '../model/warehouses.model.js';
import { WarehouseCreateData } from '../types/warehouse-create-data.interface.js';

export interface WarehouseUpdateData {
  name?: string;
  address?: string;
  capacity?: number;
}

export abstract class IWarehouseService {
  abstract create(data: WarehouseCreateData): Promise<WarehouseModel>;
  abstract findOne(id: string): Promise<WarehouseModel>;
  abstract findAll(): Promise<WarehouseModel[]>;
  abstract update(
    id: string,
    data: WarehouseUpdateData,
  ): Promise<WarehouseModel>;
  abstract updateCapacity(
    id: string,
    newCapacity: number,
  ): Promise<WarehouseModel>;
  abstract delete(id: string): Promise<void>;
}
