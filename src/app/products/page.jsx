import { Suspense } from 'react';

import PaginationControls from '@/components/shared/product/PaginationControls';
import AllProductList from '@/components/shared/product/AllProduct';
import ProductFilters from '@/components/shared/product/ProductFilters';
import { fetchProducts } from '@/lib/action/product-action';

// export const dynamic = 'force-dynamic';



export default async function ProductsPage({ searchParams }) {
  const params = {
    query: searchParams.query || '',
    category: searchParams.category || '',
    tag: searchParams.tag || '',
    minPrice: Number(searchParams.minPrice) || 0,
    maxPrice: Number(searchParams.maxPrice) || 1000000,
    rating: Number(searchParams.rating) || 0,
    sort: searchParams.sort || 'newest',
    page: Number(searchParams.page) || 1,
    limit: 12,
    featured: searchParams.featured === 'true',
  };

  const { products, pagination } = await fetchProducts(params);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside>
          <Suspense fallback={<div>Loading filters...</div>}>
            <ProductFilters searchParams={searchParams} />
          </Suspense>
        </aside>

        <main className="lg:col-span-3">
          <AllProductList products={products} />
          <PaginationControls pagination={pagination} />
        </main>
      </div>
    </div>
  );
}
