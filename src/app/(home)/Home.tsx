"use client"

import ProductLoadingSkeleton from "@/components/ProductLoadingSkeleton";
import RgbProducts from "@/components/RgbProduct";

import ProductList from "@/components/shared/product/ProductList";
import TopSellingProduct from "@/components/shared/product/TopSellingProduct";
import { useProducts } from "@/hooks/UseOrders";

export default  function Home() {
  const {products , isLoading} = useProducts()
if (isLoading) {
  return <ProductLoadingSkeleton />
}
  return (
    <div>

   
<ProductList products = {products?.products || []} />
<RgbProducts  products = {products?.products || []}  />
         
    <TopSellingProduct products = {products?.products || []}  />
                
    </div>
  );
}
