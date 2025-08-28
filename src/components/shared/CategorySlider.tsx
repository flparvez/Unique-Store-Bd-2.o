"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

import Image from "next/image";
import Link from "next/link";

import ProductLoadingSkeleton from "../ProductLoadingSkeleton";
import { ICategory } from "@/types/product";

const CategorySlider = ({ category }: { category: ICategory[] }) => {
  if (!category) {
    return <ProductLoadingSkeleton />;
  }

  return (
    <div className="w-full bg-[#ffe9e7] sm:w-[70%] mx-auto">
      <Swiper
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          260: { slidesPerView: 2 },
          360: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 7 },
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        {category?.map((category) => (
          <SwiperSlide key={category._id} className="flex-shrink-0">
            <Link
              href={`/products/${category.slug}`}
              className="block relative group"
            >
              <div className="relative w-full h-40 sm:h-48 lg:h-56">
                <Image
                  src={category.images[0].url}
                  alt={category.name}
                  fill
                  priority={false}
                  className="rounded object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 200px"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-black/50 py-1 rounded-b">
                <h3 className="text-sm font-semibold text-white text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
