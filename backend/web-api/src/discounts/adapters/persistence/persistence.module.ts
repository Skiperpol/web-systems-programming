import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountTypeOrmEntity } from './discount.entity.js';
import { DiscountTypeOrmRepository } from './discount-typeorm.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountTypeOrmEntity])],
  providers: [DiscountTypeOrmRepository],
  exports: [DiscountTypeOrmRepository],
})
export class PersistenceModule {}
