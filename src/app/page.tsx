

import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";


export default async function Home() {

          const response = await apiClient.getProducts();

      
  return (
    <div>
      <Link className="text-xl " href="/admin/product/create-product">Create Product</Link>
      <h2 className="text-2xl text-red-700">Next Js Landing Page</h2>
   <ProductList product={response} />

      <h2>Category</h2>

<CategoryList />
    </div>
  );
}
