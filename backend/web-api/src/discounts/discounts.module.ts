import { Module } from '@nestjs/common';
import { DiscountController } from './adapters/api/discounts.controller';
import { IDiscountService } from './domain/ports/i-discounts.service';
import { DiscountService } from './application/discounts.service';
import { IDiscountRepository } from './domain/ports/i-discounts.repository';
import { DiscountTypeOrmRepository } from './adapters/persistence/discount-typeorm.repository';
import { PersistenceModule } from './adapters/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [DiscountController],
  providers: [
    { provide: IDiscountService, useClass: DiscountService },
    { provide: IDiscountRepository, useClass: DiscountTypeOrmRepository },
  ],
  exports: [IDiscountService],
})
export class DiscountsModule {}
