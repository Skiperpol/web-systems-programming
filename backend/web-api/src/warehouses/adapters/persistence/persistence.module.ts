import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseTypeOrmEntity } from './warehouse.entity.js';
import { WarehouseTypeOrmRepository } from './warehouse-typeorm.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseTypeOrmEntity])],
  providers: [WarehouseTypeOrmRepository],
  exports: [WarehouseTypeOrmRepository],
})
export class PersistenceModule {}
