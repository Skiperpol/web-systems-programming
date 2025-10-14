import { Module } from '@nestjs/common';
import { ClientController } from './adapters/api/clients.controller';
import { IClientService } from './domain/ports/i-clients.service';
import { ClientService } from './application/clients.service';
import { IClientRepository } from './domain/ports/i-clients.repository';
import { ClientTypeOrmRepository } from './adapters/persistence/client-typeorm.repository';
import { PersistenceModule } from './adapters/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ClientController],
  providers: [
    { provide: IClientService, useClass: ClientService },
    { provide: IClientRepository, useClass: ClientTypeOrmRepository },
  ],
  exports: [IClientService],
})
export class ClientsModule {}
