import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from './adapters/api/warehouses.controller.js';
import { IWarehouseService } from './domain/ports/i-warehouses.service.js';
import { WarehouseService } from './application/warehouses.service.js';
import { IWarehouseRepository } from './domain/ports/i-warehouses.repository.js';
import { WarehouseTypeOrmRepository } from './adapters/persistence/warehouse-typeorm.repository.js';
import { WarehouseTypeOrmEntity } from './adapters/persistence/warehouse.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseTypeOrmEntity])],
  controllers: [WarehouseController],
  providers: [
    { provide: IWarehouseService, useClass: WarehouseService },
    { provide: IWarehouseRepository, useClass: WarehouseTypeOrmRepository },
  ],
  exports: [IWarehouseService],
})
export class WarehousesModule {}
