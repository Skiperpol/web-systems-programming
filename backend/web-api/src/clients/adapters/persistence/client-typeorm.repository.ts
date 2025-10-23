// clients/adapters/persistence/client-typeorm.repository.ts

import { IClientRepository } from '../../domain/ports/i-clients.repository.js';
import { ClientModel } from '../../domain/model/clients.model.js';
import { ClientTypeOrmEntity } from './client.entity.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ClientTypeOrmRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientTypeOrmEntity)
    private readonly repository: Repository<ClientTypeOrmEntity>,
  ) {}

  private toDomain(entity: ClientTypeOrmEntity): ClientModel {
    return new ClientModel(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.phone,
    );
  }

  private toPersistence(model: ClientModel): ClientTypeOrmEntity {
    const entity = new ClientTypeOrmEntity();
    entity.id = model.id;
    entity.firstName = model.firstName;
    entity.lastName = model.lastName;
    entity.email = model.email;
    entity.phone = model.phone;
    return entity;
  }

  async save(client: ClientModel): Promise<ClientModel> {
    const entity = this.toPersistence(client);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<ClientModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<ClientModel[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteAll(): Promise<void> {
    await this.repository.clear();
  }
}
