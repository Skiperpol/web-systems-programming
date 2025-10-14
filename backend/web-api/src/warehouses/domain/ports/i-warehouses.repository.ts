import { WarehouseModel } from '../model/warehouses.model';

export abstract class IWarehouseRepository {
  abstract save(warehouse: WarehouseModel): Promise<WarehouseModel>;
  abstract findById(id: string): Promise<WarehouseModel | null>;
  abstract findAll(): Promise<WarehouseModel[]>;
  abstract delete(id: string): Promise<void>;
}
