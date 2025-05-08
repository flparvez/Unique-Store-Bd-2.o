
import CategorySlider from "@/components/shared/CategorySlider";
import FeaturedProduct from "@/components/shared/home/FeaturedProduct";
import ProductList from "@/components/shared/product/ProductList";

export default async function Home() {


  return (
    <div>

      <FeaturedProduct />
  <CategorySlider />
        
<ProductList />
    
     
    </div>
  );
}
