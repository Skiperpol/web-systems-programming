import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTypeOrmEntity } from '../clients/adapters/persistence/client.entity';
import { ProductTypeOrmEntity } from '../products/adapters/persistence/product.entity';
import { WarehouseTypeOrmEntity } from '../warehouses/adapters/persistence/warehouse.entity';
import { DiscountTypeOrmEntity } from '../discounts/adapters/persistence/discount.entity';
import { SeederService } from './application/seeder.service';
import { SeederTypeOrmRepository } from './adapters/persistence/seeder-typeorm.repository';
import { SeederController } from './adapters/http/seeder.controller';

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
