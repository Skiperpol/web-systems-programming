import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountTypeOrmEntity } from './discount.entity';
import { DiscountTypeOrmRepository } from './discount-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountTypeOrmEntity])],
  providers: [DiscountTypeOrmRepository],
  exports: [DiscountTypeOrmRepository],
})
export class PersistenceModule {}
