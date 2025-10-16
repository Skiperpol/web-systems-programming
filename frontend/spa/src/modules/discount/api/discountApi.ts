import { Observable } from 'rxjs';
import { apiRunner } from '@/lib/utils';

export interface Discount {
  id: string;
  name: string;
  percentage: number;
  description: string;
}

export const getDiscounts = (): Observable<Discount[]> => {
  return apiRunner<Discount[]>('/discounts');
};

export const getDiscountById = (id: string): Observable<Discount> => {
  return apiRunner<Discount>(`/discounts/${id}`);
};

export const createDiscount = (discount: Omit<Discount, 'id'>): Observable<Discount> => {
  return apiRunner<Discount>('/discounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discount),
  });
};

export const updateDiscount = (id: string, discount: Partial<Discount>): Observable<Discount> => {
  return apiRunner<Discount>(`/discounts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(discount),
  });
};

export const deleteDiscount = (id: string): Observable<void> => {
  return apiRunner<void>(`/discounts/${id}`, {
    method: 'DELETE',
  });
};
