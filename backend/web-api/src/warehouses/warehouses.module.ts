import { Module } from '@nestjs/common';
import { WarehouseController } from './adapters/api/warehouses.controller';
import { IWarehouseService } from './domain/ports/i-warehouses.service';
import { WarehouseService } from './application/warehouses.service';
import { IWarehouseRepository } from './domain/ports/i-warehouses.repository';
import { WarehouseTypeOrmRepository } from './adapters/persistence/warehouse-typeorm.repository';
import { PersistenceModule } from './adapters/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [WarehouseController],
  providers: [
    { provide: IWarehouseService, useClass: WarehouseService },
    { provide: IWarehouseRepository, useClass: WarehouseTypeOrmRepository },
  ],
  exports: [IWarehouseService],
})
export class WarehousesModule {}
