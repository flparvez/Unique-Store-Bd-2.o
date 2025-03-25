'use client';

import { ProductEditForm } from '@/components/EditProduct';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { IProduct } from '@/models/Product';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(params.id)
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch product data
        const productRes = await fetch(`/api/products/${params.id}`);
        if (!productRes.ok) throw new Error('Failed to fetch product');
        const productData = await productRes.json();
        setProduct(productData.data);

        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8 text-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ProductEditForm 
        categories={categories} 
        initialProduct={product} 
      />
    </div>
  );
}