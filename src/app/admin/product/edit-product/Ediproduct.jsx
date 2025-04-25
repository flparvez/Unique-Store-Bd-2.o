"use client"
import { ProductEditForm } from '@/components/admin/EditProduct';

import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const EditProduct = ({product}) => {

  const params = useParams();
//   const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
  
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

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

  return (
   <div className="container py-8">
        <ProductEditForm 
          categories={categories} 
         product={product?.product}
        />
      </div>
  )
}

export default EditProduct
