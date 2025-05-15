"use client";

import Image from "next/image";
import Link from "next/link";
import {  ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product";


const ProductList = ({products}:{products:IProduct[]}) => {

  const sliceProdct = [...products].sort((a, b) => b.lastUpdatedIndex! - a.lastUpdatedIndex!).slice(0,24);
  const { addToCart } = useCart();


  return (
    <div className="container mx-auto sm:px-4 sm:py-4">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Our Products</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sliceProdct?.map((product) => (
           
           <div key={product._id} 
           className="bg-white rounded-lg   hover:shadow-sm transition-shadow duration-200 overflow-hidden "
    
         >
         <Link href={`/product/${product.slug}`} prefetch={true}>
             <div className="relative aspect-square">
               <Image
                   src={product.images[0].url || "/placeholder-product.jpg"}
                 alt={product.name}
                 fill
                 className="object-cover"
                 sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
               />
           {
             product?.discount ?  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
             {product?.discount}% OFF
           </span> : null
           }
             </div>
           
             </Link>
           <div className="p-2">
           <Link href={`/product/${product.slug}`} prefetch={true}>
               <h3 className=" sm:text-lg text-sm font-bold mb-1 line-clamp-2 hover:text-blue-600 transition">
                 {product.shortName}
               </h3>
         
     </Link>
            
     
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-lg font-bold text-gray-800">
                 ৳{product.price}
                 </p>
                 {product.originalPrice && product.originalPrice > product.price && (
                   <p className="text-sm text-gray-500 line-through">
                     ৳{product.originalPrice}
                   </p>
                 )}
               </div>
           

               {/* add to cart */}
               <div className={`flex space-x-2 transition-opacity  hover:opacity-100 opacity-0}`}>
                 <button   onClick={() => addToCart(product)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                   <ShoppingCart size={18} />
                 </button>
              
              
             </div>



           </div>
           </div>
          
         </div>
      
        ))}
      </div>
 <div className="flex justify-center text-center ">
 <Link href={"/products"} >  <Button>Load All Products</Button>
 </Link>
 </div>
      </div>


  );
};

// Sub-components with proper prop types




// const PaginationControls = ({ pagination }: { pagination: Pagination }) => (
//   <div className="mt-8 flex justify-center">
//     <div className="join">
//       <button className="join-item btn">«</button>
//       <button className="join-item btn">Page {pagination?.page}</button>
//       <button className="join-item btn">»</button>
//     </div>
//   </div>
// );





export default ProductList;