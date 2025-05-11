

import { ProductCreateForm } from "@/components/admin/CreateProduct";
import { getAllCategory } from "@/lib/action /product-action";



import { Loader2 } from 'lucide-react';

export default async function CreateProduct() {
  
  const categories = (await getAllCategory()).slice(0, 4)

  if (!categories) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="px-4 py-8 mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <ProductCreateForm 
        categories={categories} 
       
      />
    </div>
  );
}