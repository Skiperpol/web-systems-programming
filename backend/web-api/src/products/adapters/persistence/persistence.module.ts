import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeOrmEntity } from './product.entity';
import { ProductTypeOrmRepository } from './product-typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeOrmEntity])],
  providers: [ProductTypeOrmRepository],
  exports: [ProductTypeOrmRepository],
})
export class PersistenceModule {}
