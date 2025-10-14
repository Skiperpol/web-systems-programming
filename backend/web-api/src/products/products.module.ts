// products/product.module.ts

import { Module } from '@nestjs/common';
import { ProductController } from './adapters/api/product.controller';
import { IProductService } from './domain/ports/i-product.service';
import { ProductService } from './application/product.service';
import { IProductRepository } from './domain/ports/i-product.repository';
import { ProductTypeOrmRepository } from './adapters/persistence/product-typeorm.repository';
import { PersistenceModule } from './adapters/persistence/persistence.module';

@Module({
  imports: [PersistenceModule], // Importujemy moduł z Adapterem Repozytorium
  controllers: [ProductController],
  providers: [
    // 1. Zapewnienie IProductService (Portu Wejściowego)
    { provide: IProductService, useClass: ProductService },

    // 2. Zapewnienie IProductRepository (Portu Wyjściowego)
    // Zauważ, że to Repozytorium TypeORM jest importowane z PersistenceModule,
    // ale dostarczane jako implementacja Interfejsu (Portu).
    { provide: IProductRepository, useClass: ProductTypeOrmRepository },
  ],
  exports: [IProductService], // Eksportuj tylko Port Wejściowy dla innych Modułów
})
export class ProductsModule {}
