"use client"
import ProductLoadingSkeleton from "@/components/ProductLoadingSkeleton";
import CategorySlider from "@/components/shared/CategorySlider";
import FeaturedProduct from "@/components/shared/home/FeaturedProduct";
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

      <FeaturedProduct products = {products?.products || []} />
  <CategorySlider />
        
<ProductList products = {products?.products || []} />
    <TopSellingProduct products = {products?.products || []}  />
     
    </div>
  );
}
