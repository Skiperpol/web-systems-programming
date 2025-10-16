import { Observable } from 'rxjs';
import { apiRunner } from '@/lib/utils';

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
}

export const getWarehouses = (): Observable<Warehouse[]> => {
  return apiRunner<Warehouse[]>('/warehouses');
};

export const getWarehouseById = (id: string): Observable<Warehouse> => {
  return apiRunner<Warehouse>(`/warehouses/${id}`);
};

export const createWarehouse = (warehouse: Omit<Warehouse, 'id'>): Observable<Warehouse> => {
  return apiRunner<Warehouse>('/warehouses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(warehouse),
  });
};

export const updateWarehouse = (id: string, warehouse: Partial<Warehouse>): Observable<Warehouse> => {
  return apiRunner<Warehouse>(`/warehouses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(warehouse),
  });
};

export const deleteWarehouse = (id: string): Observable<void> => {
  return apiRunner<void>(`/warehouses/${id}`, {
    method: 'DELETE',
  });
};
