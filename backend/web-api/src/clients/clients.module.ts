import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './adapters/api/clients.controller.js';
import { IClientService } from './domain/ports/i-clients.service.js';
import { ClientService } from './application/clients.service.js';
import { IClientRepository } from './domain/ports/i-clients.repository.js';
import { ClientTypeOrmRepository } from './adapters/persistence/client-typeorm.repository.js';
import { ClientTypeOrmEntity } from './adapters/persistence/client.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClientTypeOrmEntity])],
  controllers: [ClientController],
  providers: [
    { provide: IClientService, useClass: ClientService },
    { provide: IClientRepository, useClass: ClientTypeOrmRepository },
  ],
  exports: [IClientService],
})
export class ClientsModule {}
