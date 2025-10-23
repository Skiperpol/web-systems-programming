import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTypeOrmEntity } from '../clients/adapters/persistence/client.entity.js';
import { ProductTypeOrmEntity } from '../products/adapters/persistence/product.entity.js';
import { WarehouseTypeOrmEntity } from '../warehouses/adapters/persistence/warehouse.entity.js';
import { DiscountTypeOrmEntity } from '../discounts/adapters/persistence/discount.entity.js';
import { SeederService } from './application/seeder.service.js';
import { SeederTypeOrmRepository } from './adapters/persistence/seeder-typeorm.repository.js';
import { SeederController } from './adapters/http/seeder.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientTypeOrmEntity,
      ProductTypeOrmEntity,
      WarehouseTypeOrmEntity,
      DiscountTypeOrmEntity,
    ]),
  ],
  controllers: [SeederController],
  providers: [
    {
      provide: 'ISeederRepositoryPort',
      useClass: SeederTypeOrmRepository,
    },
    {
      provide: 'ISeederServicePort',
      useClass: SeederService,
    },
  ],
  exports: ['ISeederServicePort'],
})
export class SeederModule {}
