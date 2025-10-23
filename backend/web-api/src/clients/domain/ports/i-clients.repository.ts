import { ClientModel } from '../model/clients.model.js';

export abstract class IClientRepository {
  abstract save(client: ClientModel): Promise<ClientModel>;
  abstract findById(id: string): Promise<ClientModel | null>;
  abstract findAll(): Promise<ClientModel[]>;
  abstract delete(id: string): Promise<void>;
}
