import { Observable } from 'rxjs';
import { apiRunner } from '@/lib/utils';

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const getClients = (): Observable<Client[]> => {
  return apiRunner<Client[]>('/clients');
};

export const getClientById = (id: string): Observable<Client> => {
  return apiRunner<Client>(`/clients/${id}`);
};

export const createClient = (client: Omit<Client, 'id'>): Observable<Client> => {
  return apiRunner<Client>('/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });
};

export const updateClient = (id: string, client: Partial<Client>): Observable<Client> => {
  return apiRunner<Client>(`/clients/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });
};

export const deleteClient = (id: string): Observable<void> => {
  return apiRunner<void>(`/clients/${id}`, {
    method: 'DELETE',
  });
};