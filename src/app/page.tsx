
import Link from "next/link";

import ProductList from "@/components/ProductList";
import CategoryList from "@/components/CategoryList";
// import CategoryList from "@/components/CategoryList";
export default async function Home() {
 
  return (
    <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Welcome to Our Store</h1>
      <Link 
        href="/admin/product/create-product" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Create Product
      </Link>
    </div>


    
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
       
            <ProductList  />
       
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <CategoryList />
        </section>
  
  </div>
  );
}