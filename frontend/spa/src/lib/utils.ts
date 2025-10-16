import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { from, Observable } from 'rxjs';
import type { ApiError } from '@/types/globalTypes';

interface RequestOptions extends RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set");
}

export function apiRunner<T>(url: string, options?: RequestOptions): Observable<T> {
  // Check if url is already a full URL (contains http:// or https://)
  const fullUrl = url.startsWith('http://') || url.startsWith('https://') 
    ? url 
    : `${BASE_URL}${url}`;
    
  return from(
    fetch(fullUrl, options).then(async (response) => {
      if (!response.ok) {
        const errorBody: ApiError = {
          status: response.status,
          message: `Server error: ${response.statusText}`,
        };
        throw errorBody;
      }
      
      return response.json() as Promise<T>;
    })
  );
}