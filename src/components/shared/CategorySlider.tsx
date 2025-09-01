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
  if (!category) return <ProductLoadingSkeleton />;

  return (
    <section className="w-full py-2 bg-gradient-to-r from-rose-50 to-orange-50">
      <div className="container mx-auto px-2">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-2 md:mb-10"
        >
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900">
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
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              el: ".category-pagination",
              bulletClass: "category-bullet",
              bulletActiveClass: "category-bullet-active",
            }}
            breakpoints={{
              0: { slidesPerView: 3, spaceBetween: 12 },
              480: { slidesPerView: 4, spaceBetween: 14 },
              640: { slidesPerView: 5, spaceBetween: 16 },
              768: { slidesPerView: 6, spaceBetween: 18 },
              1024: { slidesPerView: 7, spaceBetween: 20 },
              1280: { slidesPerView: 8, spaceBetween: 24 },
            }}
            modules={[Autoplay, Pagination]}
            className="category-swiper"
          >
            {category.map((cat) => (
              <SwiperSlide key={cat._id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="h-full"
                >
                  <Link
                    href={`/products/${cat.slug}`}
                    className="block h-full group"
                    aria-label={`Browse ${cat.name} category`}
                  >
                    <div className="relative w-full h-28 sm:h-36 md:h-44 rounded-xl overflow-hidden bg-white">
                      <Image
                        src={cat.images[0]?.url}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
                      />

                      {/* Desktop overlay hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Category name (always visible on mobile) */}
                    <div className="text-center mt-2">
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 truncate group-hover:text-rose-600 transition-colors">
                        {cat.name}
                      </h3>
                      <span className="hidden sm:block text-[11px] md:text-sm text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        দেখুন সব পণ্য →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom pagination */}
          <div className="category-pagination flex justify-center mt-2 space-x-2" />
        </motion.div>
      </div>

      <style jsx global>{`
        .category-bullet {
          width: 8px;
          height: 8px;
          background: rgba(0, 0, 0, 0.25);
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .category-bullet-active {
          width: 22px;
          background: #f43f5e;
          border-radius: 6px;
        }
        .category-swiper {
          padding: 4px 4px 20px;
        }
      `}</style>
    </section>
  );
};

export default CategorySlider;
