import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientTypeOrmEntity } from './client.entity.js';
import { ClientTypeOrmRepository } from './client-typeorm.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClientTypeOrmEntity])],
  providers: [ClientTypeOrmRepository],
  exports: [ClientTypeOrmRepository],
})
export class PersistenceModule {}
