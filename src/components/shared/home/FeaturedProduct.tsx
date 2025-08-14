"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/types/product';

// ✅ Custom hook to avoid hydration mismatch
const useMounted = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
};

const FeaturedProduct = ({ products }: { products: IProduct[] }) => {
  const filterProduct = products?.filter((product) => product.isFeatured === true);
  const sliceProdct = [...filterProduct].sort((a, b) => b.popularityScore! - a.popularityScore!);
  const mounted = useMounted();

  if (!mounted) {
    // You can return a skeleton loader here for a better user experience
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-1">
      <Swiper
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1 },
          520: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        modules={[Autoplay, Pagination]}
        className="rounded-lg py-8" // Added some padding for pagination dots
      >
        {sliceProdct?.map((product) => (
          <SwiperSlide key={product._id} className="h-auto">
            {/* The entire card is treated as one unit inside the slide */}
            <div className="flex flex-col h-full"> 
              <Link 
                href={`/product/${product.slug}`} 
                className="group block overflow-hidden rounded-lg border border-gray-200/80 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg h-full"
              >
                <div className="relative w-full h-[300px] sm:h-[350px]">
                  {/* The Image is the background layer */}
                  <Image
                    src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  
                  {/* The overlay layer sits on top of the image */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-between p-3">
                    {/* Top part of the overlay (e.g., Sale badge) */}
                    <div>
                      {product.originalPrice && (
                        <span className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          Sale
                        </span>
                      )}
                    </div>

                    {/* Middle part (hover effect) */}
                    <div className="absolute inset-0 flex items-center justify-center  bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300">
                      <button className="text-white bg-indigo-600 hover:bg-indigo-700 font-semibold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product details are separate from the image container */}
                <div className="p-4 bg-white">
                  <h3 className="text-base font-semibold text-gray-800 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-indigo-600">
                      ৳{product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        ৳{product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default FeaturedProduct;