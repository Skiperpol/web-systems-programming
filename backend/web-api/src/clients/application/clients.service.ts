import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientModel } from '../domain/model/clients.model';
import { IClientRepository } from '../domain/ports/i-clients.repository';
import {
  IClientService,
  ClientUpdateData,
} from '../domain/ports/i-clients.service';
import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';

@Injectable()
export class ClientService implements IClientService {
  constructor(
    @Inject(IClientRepository)
    private readonly clientRepository: IClientRepository,
  ) {}

  async create(data: Omit<ClientModel, 'id'>): Promise<ClientModel> {
    const newClient = new ClientModel(
      uuid(),
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
    );

    return this.clientRepository.save(newClient);
  }

  async findOne(id: string): Promise<ClientModel> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async findAll(): Promise<ClientModel[]> {
    return this.clientRepository.findAll();
  }

  async update(id: string, data: ClientUpdateData): Promise<ClientModel> {
    const client = await this.findOne(id);

    if (data.firstName !== undefined) {
      client.updateFirstName(data.firstName);
    }
    if (data.lastName !== undefined) {
      client.updateLastName(data.lastName);
    }
    if (data.email !== undefined) {
      client.updateEmail(data.email);
    }
    if (data.phone !== undefined) {
      client.updatePhone(data.phone);
    }

    return this.clientRepository.save(client);
  }

  async updateEmail(id: string, newEmail: string): Promise<ClientModel> {
    const client = await this.findOne(id);

    client.updateEmail(newEmail);

    return this.clientRepository.save(client);
  }

  async delete(id: string): Promise<void> {
    await this.clientRepository.delete(id);
  }
}
