import { Observable } from 'rxjs';
import { apiRunner } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const getProducts = (): Observable<Product[]> => {
  return apiRunner<Product[]>('/products');
};

export const getProductById = (id: string): Observable<Product> => {
  return apiRunner<Product>(`/products/${id}`);
};

export const createProduct = (product: Omit<Product, 'id'>): Observable<Product> => {
  return apiRunner<Product>('/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
};

export const updateProduct = (id: string, product: Partial<Product>): Observable<Product> => {
  return apiRunner<Product>(`/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
};

export const deleteProduct = (id: string): Observable<void> => {
  return apiRunner<void>(`/products/${id}`, {
    method: 'DELETE',
  });
};
