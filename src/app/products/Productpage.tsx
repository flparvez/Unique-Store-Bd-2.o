"use client";
import { useEffect, useState } from 'react';
import ProductsPageClient from '@/components/shared/ProductsPageClient';
import ProductFilters from '@/components/shared/ProductFilters';
import { IProduct } from '@/types/product';
import { useSearchParams } from 'next/navigation';

import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton';



export default function ProductsPage() {


      const searchParams = useSearchParams()
    
  const [products, setProducts] = useState<IProduct[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const queryParams = {
        query: searchParams.get('query') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest',
        page: searchParams.get('page') || '1',
        featured: searchParams.get('featured') || 'false',
      };

      const search = new URLSearchParams(queryParams as Record<string, string>).toString();
      const endpoint = `/api/products/filter?${search}`;
     

      try {
        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else {
          setError('Failed to fetch products.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return (
    <div className='mx-auto'>
      <aside className="mb-4">
        <ProductFilters />
      </aside>

      {loading ? (
        <div><ProductLoadingSkeleton /></div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ProductsPageClient
      success
          products={products}
          pagination={pagination}
        />
      )}
    </div>
  );
}
