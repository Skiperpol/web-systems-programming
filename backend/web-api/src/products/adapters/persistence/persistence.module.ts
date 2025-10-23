import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeOrmEntity } from './product.entity.js';
import { ProductTypeOrmRepository } from './product-typeorm.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeOrmEntity])],
  providers: [ProductTypeOrmRepository],
  exports: [ProductTypeOrmRepository],
})
export class PersistenceModule {}
