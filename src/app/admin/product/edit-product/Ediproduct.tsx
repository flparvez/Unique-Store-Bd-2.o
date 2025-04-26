// In your page component
"use client";
import { ProductEditForm } from '@/components/admin/EditProduct';
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton';
import { apiClient } from '@/lib/api-client';
import { ICategory } from '@/models/Category';

import { ApiResponseP } from '@/types/product';
import { useEffect, useState } from 'react';

export default function EditProductPage({id}: {id: string}) {
  const [product, setProduct] = useState<ApiResponseP | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [productRes, categoriesRes] = await Promise.all([
        apiClient.getProduct(id),
        apiClient.getCategories()
      ]);
      setProduct(productRes);
      setCategories(categoriesRes);
    };
    fetchData();
  }, [id]);

  if (!product) return <div><ProductLoadingSkeleton /></div>;

  return <div className='w-full py-4 px-2 '> 
    <ProductEditForm products={product} categories={categories} />
  </div>;
}