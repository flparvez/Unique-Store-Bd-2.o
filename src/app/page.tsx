

import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Link from "next/link";


export default function Home() {

  
  return (
    <div>
      <Link className="text-xl " href="/admin/create-product">Create Product</Link>
      <h2 className="text-2xl text-red-700">Next Js Landing Page</h2>
   <ProductList />

      <h2>Category</h2>

<CategoryList />
    </div>
  );
}
