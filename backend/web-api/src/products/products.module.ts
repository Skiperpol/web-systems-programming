import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './adapters/api/products.controller.js';
import { IProductService } from './domain/ports/i-products.service.js';
import { ProductService } from './application/products.service.js';
import { IProductRepository } from './domain/ports/i-products.repository.js';
import { ProductTypeOrmRepository } from './adapters/persistence/product-typeorm.repository.js';
import { ProductTypeOrmEntity } from './adapters/persistence/product.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeOrmEntity])],
  controllers: [ProductController],
  providers: [
    { provide: IProductService, useClass: ProductService },
    { provide: IProductRepository, useClass: ProductTypeOrmRepository },
  ],
  exports: [IProductService],
})
export class ProductsModule {}
