
import { Button } from '@/components/ui/button';
import { IProduct } from '@/models/Product';
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination } from 'swiper/modules';

import Link from 'next/link'
import React from 'react'
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(res => res.json());
const LatestProductm = () => {
// async function
 
const { data } = useSWR('/api/products', fetcher);

    const products = data?.products.slice(0,14)
    return (  


  <div className="block sm:hidden mt-16">

    <h2 className="text-xl font-bold text-gray-900 mb-4">Latest Products</h2>
  
     <div className="product-image-slider">
        <Swiper
          parallax={true}
          autoplay={{
            delay: 2400,
            disableOnInteraction: false,
          }}
        
          breakpoints={{
            0: { slidesPerView: 1 }, // For very small screens
            
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {products?.map((product:IProduct) => (
            <SwiperSlide key={product._id}>
        <div key={product._id} 
      className="bg-white rounded-lg  overflow-hidden hover:shadow-xl transition-shadow duration-300"

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

      <div className="p-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className=" sm:text-lg text-sm font-bold mb-1 line-clamp-2 hover:text-blue-600 transition">
            {product.shortName}
          </h3>
        </Link>

       

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-800">
            ৳{product.price}
            </p>
         
          </div>
     
          <div className={`flex space-x-2 transition-opacity  hover:opacity-100 opacity-0}`}>
          {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-gray-500 line-through">
                ৳{product.originalPrice}
              </p>
            )}
         
          </div>
        </div>
      </div>
    </div>
  
            </SwiperSlide>
          ))}
        </Swiper>
      </div>


        <div className='flex justify-center mt-2'>
 <Link href={"/products"} >  <Button>Load All Products</Button>
   </Link>
       </div>
  </div>

    )
}

export default LatestProductm
