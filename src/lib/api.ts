// utils/api.ts

import { apiClient } from './api-client';

export async function safeFetchProducts() {
  try {
    return await apiClient.getProducts();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  
  }
}