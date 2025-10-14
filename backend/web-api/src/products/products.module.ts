import { Module } from '@nestjs/common';
import { ProductController } from './adapters/api/products.controller';
import { IProductService } from './domain/ports/i-products.service';
import { ProductService } from './application/products.service';
import { IProductRepository } from './domain/ports/i-products.repository';
import { ProductTypeOrmRepository } from './adapters/persistence/product-typeorm.repository';
import { PersistenceModule } from './adapters/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ProductController],
  providers: [
    { provide: IProductService, useClass: ProductService },
    { provide: IProductRepository, useClass: ProductTypeOrmRepository },
  ],
  exports: [IProductService],
})
export class ProductsModule {}
