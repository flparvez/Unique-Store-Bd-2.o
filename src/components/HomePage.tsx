"use client";

import useSWR from 'swr';
import Link from "next/link";
const fetcher = (url: string) => fetch(url).then(res => res.json());
import ProductList from "./shared/product/ProductList";
import ProductLoadingSkeleton from './ProductLoadingSkeleton';





// import CategoryList from "@/components/CategoryList";
export default  function HomePage() {
  const { data } = useSWR('/api/products', fetcher);
if (!data) {
  <ProductLoadingSkeleton />
}
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Welcome to Our Store</h1>
      <Link 
        href="/admin/products/create-product" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Create Product
      </Link>
    </div>


    
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
       
            <ProductList 
           data={data?.products}
            />
       
        </section>

   
  </div>
  );
}