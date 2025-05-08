"use client"
import ProductLoadingSkeleton from '@/components/ProductLoadingSkeleton'
import { useProducts } from '@/hooks/UseOrders'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';




  // ✅ Custom hook to avoid hydration mismatch
  const useMounted = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted;
  };
const FeaturedProduct = () => {
    const {products , isLoading} = useProducts()
//  filter by featured

const filterProduct = products?.products.filter((product) => product.isFeatured === true)

const mounted = useMounted();
if (!mounted) return null;

    if (isLoading) {
        return <ProductLoadingSkeleton />
    }
    return (
        <div className="w-full max-w-7xl mx-auto py-4 ">
      <Swiper
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        modules={[Autoplay, Pagination]}
        className="rounded-lg"
      >
        {filterProduct?.map((product) => (
          <SwiperSlide key={product._id}>
            <Link href={`/product/${product.slug}`} className="block group relative">
              <div className="relative w-full h-[300px] sm:h-[350px] overflow-hidden rounded-lg shadow-md transition-transform transform hover:scale-95">
                <Image
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  fill
                  className="object-cover transition-all group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
                <span className="absolute top-4 left-5 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Featured
                </span>

          
                <div className="absolute top-2 right-2 text-right">
                
                  <p className="text-sm font-bold mt-4 text-orange-700  line-through px-2 py-0.5  rounded">
                    ৳{product?.originalPrice}
                  </p>
                  <p className="text-sm font-bold bg-green-400 text-black mt-4 px-2 py-1 rounded">
                    ৳{product.price}
                  </p>
                  
                </div>
               
              </div>
              <div className="justify-center px-2 text-center">
              <h3 className="text-sm absolute bottom-2 left-2 bg-black text-white text-center sm:text-base font-semibold line-clamp-1">
                 {product.name}
                </h3>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    )
}

export default FeaturedProduct
