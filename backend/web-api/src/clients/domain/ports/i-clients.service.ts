import { ClientModel } from '../model/clients.model';
import { ClientCreateData } from '../types/client-create-data.interface';

export abstract class IClientService {
  abstract create(data: ClientCreateData): Promise<ClientModel>;
  abstract findOne(id: string): Promise<ClientModel>;
  abstract findAll(): Promise<ClientModel[]>;
  abstract updateEmail(id: string, newEmail: string): Promise<ClientModel>;
  abstract delete(id: string): Promise<void>;
}
