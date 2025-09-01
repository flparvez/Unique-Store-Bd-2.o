"use client"

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IProduct } from '@/types/product';
import { FaEye, FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';

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
    return (
      <div className="w-full max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-7 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-1">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-2"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 ">
            বিশেষ অফার
          </h2>
        </motion.div>

        {/* Products Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true 
            }}
            pagination={{
              clickable: true,
              el: '.featured-pagination',
              bulletClass: 'featured-bullet',
              bulletActiveClass: 'featured-bullet-active',
            }}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              520: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 4 },
            }}
            modules={[Autoplay, Pagination]}
            className="featured-swiper pb-4"
          >
            {sliceProdct?.map((product) => (
              <SwiperSlide key={product._id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="h-full"
                >
                  <div className="flex flex-col h-full bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <Link 
                      href={`/product/${product.slug}`} 
                      className="group block relative overflow-hidden"
                      aria-label={`View details for ${product.name}`}
                    >
                      <div className="relative w-full h-72">
                        <Image
                          src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          loading="lazy"
                        />
                        
                        {/* Sale badge */}
                        {product.originalPrice && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        )}
                        
                        {/* Rating badge */}
                        {product.rating && (
                          <div className="absolute top-4 right-4 z-10 bg-white bg-opacity-95 rounded-full px-2.5 py-1 shadow-md flex items-center">
                            <FaStar className="text-yellow-400 mr-1 text-sm" />
                            <span className="text-xs font-semibold text-gray-800">{product.rating}</span>
                          </div>
                        )}
                        
                        {/* Hover overlay with actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <button 
                              className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors"
                              aria-label="Quick view"
                            >
                              <FaEye className="text-lg" />
                            </button>
                            <button 
                              className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors"
                              aria-label="Add to cart"
                            >
                              <FaShoppingCart className="text-lg" />
                            </button>
                            <button 
                              className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors"
                              aria-label="Add to wishlist"
                            >
                              <FaHeart className="text-lg" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Product details */}
                    <div className="p-5 flex-grow flex flex-col">
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors" title={product.name}>
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="mt-auto pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-xl font-bold text-indigo-600">
                              ৳{product.price}
                            </p>
                            {product.originalPrice && (
                              <p className="text-sm text-gray-500 line-through ml-2">
                                ৳{product.originalPrice}
                              </p>
                            )}
                          </div>
                          
                          <button 
                            className="bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white p-2.5 rounded-full transition-colors"
                            aria-label="Add to cart"
                          >
                            <FaShoppingCart className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom pagination */}
          <div className="featured-pagination flex justify-center mt-1 space-x-2" />
        </motion.div>

        {/* View all button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link 
            href="/products" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            সকল পণ্য দেখুন
            <FaEye className="ml-2" />
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .featured-bullet {
          width: 10px;
          height: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          display: inline-block;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .featured-bullet-active {
          width: 24px;
          background: #4f46e5;
          border-radius: 8px;
        }
        
        .featured-swiper {
          padding: 8px 4px 24px;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

export default FeaturedProduct;