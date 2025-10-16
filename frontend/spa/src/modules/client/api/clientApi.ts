// src/features/product/api/productApi.ts
import { Observable } from 'rxjs';
import type { ClientType } from '../types/Client';
import { apiRunner } from '@/lib/utils';

export const getClients = (): Observable<ClientType[]> => {
  return apiRunner<ClientType[]>('/clients');
};

export const getClientById = (id: string): Observable<ClientType> => {
  return apiRunner<ClientType>(`/clients/${id}`);
};

export const createClient = (client: ClientType): Observable<ClientType> => {
  return apiRunner<ClientType>('/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  });
};

export const updateClient = (id: string, client: ClientType): Observable<ClientType> => {
  return apiRunner<ClientType>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(client),
  });
};

export const deleteClient = (id: string): Observable<void> => {
  return apiRunner<void>(`/clients/${id}`, {
    method: 'DELETE',
  });
};