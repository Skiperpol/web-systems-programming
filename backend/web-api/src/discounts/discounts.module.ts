import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountController } from './adapters/api/discounts.controller';
import { IDiscountService } from './domain/ports/i-discounts.service';
import { DiscountService } from './application/discounts.service';
import { IDiscountRepository } from './domain/ports/i-discounts.repository';
import { DiscountTypeOrmRepository } from './adapters/persistence/discount-typeorm.repository';
import { DiscountTypeOrmEntity } from './adapters/persistence/discount.entity';

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
