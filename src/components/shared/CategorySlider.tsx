"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import ProductLoadingSkeleton from "../ProductLoadingSkeleton";
import { ICategory } from "@/types/product";

const CategorySlider = ({ category }: { category: ICategory[] }) => {
  if (!category) {
    return <ProductLoadingSkeleton />;
  }

  return (
    <section className="w-full py-4 bg-gradient-to-r from-rose-50 to-orange-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">
        Unique Store Bd - Category
          </h2>
      
        </motion.div>

        {/* Category Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Swiper
            autoplay={{
              delay: 4200,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: '.category-pagination',
              bulletClass: 'category-bullet',
              bulletActiveClass: 'category-bullet-active',
            }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 12 },
              480: { slidesPerView: 3, spaceBetween: 16 },
              640: { slidesPerView: 4, spaceBetween: 16 },
              768: { slidesPerView: 5, spaceBetween: 20 },
              1024: { slidesPerView: 6, spaceBetween: 24 },
              1280: { slidesPerView: 7, spaceBetween: 24 },
            }}
            modules={[Autoplay, Pagination]}
            className="category-swiper"
          >
            {category?.map((category) => (
              <SwiperSlide key={category._id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="h-full"
                >
                  <Link
                    href={`/products/${category.slug}`}
                    className="block h-full group"
                    aria-label={`Browse ${category.name} category`}
                  >
                    <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-lg bg-white">
                      <Image
                        src={category.images[0].url}
                        alt={category.name}
                        fill
                        priority={false}
                        className="object-cover transition-all duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 14vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                        <h3 className="text-sm md:text-base font-semibold text-white truncate transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          {category.name}
                        </h3>
                        <span className="text-xs text-rose-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 block">
                          দেখুন সব পণ্য →
                        </span>
                      </div>
                      
                      {/* Hover effect border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-rose-300/30 rounded-2xl transition-all duration-300" />
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom pagination */}
          <div className="category-pagination flex justify-center mt-8 space-x-2" />
        </motion.div>
      </div>

      <style jsx global>{`
        .category-bullet {
          width: 10px;
          height: 10px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 50%;
          display: inline-block;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .category-bullet-active {
          width: 24px;
          background: #f43f5e;
          border-radius: 8px;
        }
        
        .category-swiper {
          padding: 8px 4px 24px;
        }
      `}</style>
    </section>
  );
};

export default CategorySlider;