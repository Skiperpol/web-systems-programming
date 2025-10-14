import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseController } from './adapters/api/warehouses.controller';
import { IWarehouseService } from './domain/ports/i-warehouses.service';
import { WarehouseService } from './application/warehouses.service';
import { IWarehouseRepository } from './domain/ports/i-warehouses.repository';
import { WarehouseTypeOrmRepository } from './adapters/persistence/warehouse-typeorm.repository';
import { WarehouseTypeOrmEntity } from './adapters/persistence/warehouse.entity';

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
