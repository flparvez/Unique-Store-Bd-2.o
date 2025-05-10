"use client"
// import { Suspense } from 'react';

import {  useProducts } from '@/hooks/UseOrders';
// import ProductFilters from '@/components/shared/product/ProductFilters';
import AllProductList from '@/components/shared/product/AllProduct';

// interface Props {
//   searchParams: {
//     query?: string;
//     minPrice?: string;
//     maxPrice?: string;
//     sort?: string;
//     page?: string;
//     featured?: string;
//   };
// }

export default function ProductsPage() {
  // const params = {
  //   query: searchParams.query || '',
  //   minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : 0,
  //   maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : 1000000,
  //   sort: searchParams.sort || 'newest',
  //   page: searchParams.page ? Number(searchParams.page) : 1,
  //   featured: searchParams.featured ?? undefined, // keep as 'true'/'false' string
  // };

  const { products, isLoading, error } = useProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        {/* <aside className="md:col-span-1">
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters searchParams={searchParams} />
          </Suspense>
        </aside> */}

        {/* Product Grid */}
        <main className="md:col-span-3">
          {isLoading && <p>Loading products...</p>}
          {error && <p className="text-red-500">Failed to load products.</p>}

          {!isLoading && products?.products?.length === 0 && (
            <p>No products found.</p>
          )}

     
              <AllProductList  products={products?.products || []} />
            
        
        </main>
      </div>
    </div>
  );
}
