// discounts/discount.module.ts

import { Module } from '@nestjs/common';
import { DiscountController } from './adapters/api/discounts.controller';
import { IDiscountService } from './domain/ports/i-discounts.service';
import { DiscountService } from './application/discounts.service';
import { IDiscountRepository } from './domain/ports/i-discounts.repository';
import { DiscountTypeOrmRepository } from './adapters/persistence/discount-typeorm.repository';
import { PersistenceModule } from './adapters/persistence/persistence.module';

@Module({
  imports: [PersistenceModule], // Importujemy moduł z Adapterem Repozytorium
  controllers: [DiscountController],
  providers: [
    // 1. Zapewnienie IDiscountService (Portu Wejściowego)
    { provide: IDiscountService, useClass: DiscountService },

    // 2. Zapewnienie IDiscountRepository (Portu Wyjściowego)
    // Zauważ, że to Repozytorium TypeORM jest importowane z PersistenceModule,
    // ale dostarczane jako implementacja Interfejsu (Portu).
    { provide: IDiscountRepository, useClass: DiscountTypeOrmRepository },
  ],
  exports: [IDiscountService], // Eksportuj tylko Port Wejściowy dla innych Modułów
})
export class DiscountsModule {}
