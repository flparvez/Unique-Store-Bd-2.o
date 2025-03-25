'use client';
import {ProductUploadForm} from "@/components/admin/CreateProduct";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { Loader2 } from 'lucide-react';

export default function CreateProduct() {
  const params = useParams();
//   const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
console.log(params.id)
  useEffect(() => {
    async function fetchData() {
      try {
  
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



  return (
    <div className="container py-8">
      <ProductUploadForm 
        categories={categories} 
       
      />
    </div>
  );
}