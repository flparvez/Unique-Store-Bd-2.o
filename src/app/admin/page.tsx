export const dynamic = 'force-dynamic'; // Add this at the top

import AdminComponent from '@/components/admin/AdminComponent';
import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/product'; // Make sure to import your ApiResponse type
import React from 'react';

const Admin = async () => {
  let products: ApiResponse | null = null;
  let error: string | null = null;

  try {
    const response = await apiClient.getProducts();
    products = response;
  } catch (err) {
    console.error('Error fetching products:', err);
    error = err instanceof Error ? err.message : 'Failed to load products';
  }

  return (
    <div>
      {error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <AdminComponent product={products} />
      )}
    </div>
  );
};

export default Admin;