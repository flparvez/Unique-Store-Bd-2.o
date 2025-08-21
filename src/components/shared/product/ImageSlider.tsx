// components/shared/product/ImageSlider.tsx
"use client"

import { useState } from 'react';
import type { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import { IProductImage } from '@/models/Product';

// Import all necessary Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface ImageSliderProps {
  images: IProductImage[];
  discount: number;
}

const ImageSlider = ({ images, discount }: ImageSliderProps) => {
    const [thumbsSwiper, setThumbsSwiper]  = useState<SwiperCore | null>(null);

    // A fallback UI in case there are no images, preventing errors.
    if (!images || images.length === 0) {
        return (
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No Image Available</p>
            </div>
        );
    }

    return (
        // Flex container is active on all screen sizes for a consistent 80/20 layout.
        // It has a responsive height to look good on different devices.
        <div className="flex w-full gap-2 h-[400px] sm:h-[450px] md:h-[500px]">
            
            {/* Main Image Viewer (Left Side - 80% width on all screens) */}
            <div className="w-4/5 h-full relative ">
                <Swiper
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2 w-full h-full rounded-lg bg-gray-100"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-full">
                                <Image
                                    fill
                                    src={image.url}
                                    alt={`Product image ${index + 1}`}
                                    // UPDATED: 'object-cover' makes the image fill the entire container, making it appear larger.
                                    className="object-cover"
                                    sizes="(max-width: 768px) 80vw, 60vw"
                                    priority={index === 0}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Discount Badge */}
                {discount > 0 && (
                    // UPDATED: Positioned further from the edge for a cleaner look.
                    <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        -{discount}%
                    </span>
                )}
            </div>

            {/* Thumbnail Gallery Slider (Right Side - 20% width on all screens) */}
            <div className="w-1/5 h-full">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={4}
                    direction="vertical"
                    spaceBetween={8}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    className="mySwiperThumbs h-full"
                >
                    {images.map((image, index) => (
                        <SwiperSlide
                            key={index}
                            className="opacity-50 cursor-pointer rounded-md overflow-hidden border-2 border-transparent transition-all duration-300 hover:opacity-100 swiper-slide-thumb-active:opacity-100 swiper-slide-thumb-active:border-blue-500"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    fill
                                    src={image.url}
                                    alt={`Product thumbnail ${index + 1}`}
                                    className="object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default ImageSlider;