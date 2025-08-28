"use client"

import ProductLoadingSkeleton from "@/components/ProductLoadingSkeleton";
import RgbProducts from "@/components/RgbProduct";

import ProductList from "@/components/shared/product/ProductList";
import TopSellingProduct from "@/components/shared/product/TopSellingProduct";

import { IProduct } from "@/types/product";

export default  function Home({products}:{products:IProduct[]}) {
 
if (!products) {
  return <ProductLoadingSkeleton />
}
  return (
    <div>

   
<ProductList products = {products || []} />
<RgbProducts  products = {products || []}  />
         
    <TopSellingProduct products = {products || []}  />
                
    </div>
  );
}
