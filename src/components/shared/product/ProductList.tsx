"use client";



import {   IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";


const ProductList = ({data}:{data:IProduct[]}) => {
  const { addToCart } = useCart();


  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">Our Products</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.map((product) => (
           <div key={product._id} 
           className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    
         >
           <Link href={`/product/${product.slug}`} className="block">
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
     
           <div className="p-4">
             <Link href={`/product/${product.slug}`}>
               <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition">
                 {product.name}
               </h3>
             </Link>
     
             <div className="flex items-center mb-2">
               <div className="flex text-yellow-400">
                 {[...Array(5)].map((_, i) => (
                   <Star
                     key={i}
                     size={16}
                     fill={i < (product.rating || 0) ? "currentColor" : "none"}
                   />
                 ))}
               </div>
               <span className="text-gray-500 text-sm ml-1">
                 ({product.reviews?.length || 0})
               </span>
             </div>
     
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-lg font-bold text-gray-800">
                 ৳{product.price.toFixed(2)}
                 </p>
                 {product.originalPrice && product.originalPrice > product.price && (
                   <p className="text-sm text-gray-500 line-through">
                     ৳{product.originalPrice.toFixed(2)}
                   </p>
                 )}
               </div>
          
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