import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountController } from './adapters/api/discounts.controller.js';
import { IDiscountService } from './domain/ports/i-discounts.service.js';
import { DiscountService } from './application/discounts.service.js';
import { IDiscountRepository } from './domain/ports/i-discounts.repository.js';
import { DiscountTypeOrmRepository } from './adapters/persistence/discount-typeorm.repository.js';
import { DiscountTypeOrmEntity } from './adapters/persistence/discount.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountTypeOrmEntity])],
  controllers: [DiscountController],
  providers: [
    { provide: IDiscountService, useClass: DiscountService },
    { provide: IDiscountRepository, useClass: DiscountTypeOrmRepository },
  ],
  exports: [IDiscountService],
})
export class DiscountsModule {}
