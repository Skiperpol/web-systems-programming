import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseTypeOrmEntity } from './warehouse.entity';
import { WarehouseTypeOrmRepository } from './warehouse-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseTypeOrmEntity])],
  providers: [WarehouseTypeOrmRepository],
  exports: [WarehouseTypeOrmRepository],
})
export class PersistenceModule {}
