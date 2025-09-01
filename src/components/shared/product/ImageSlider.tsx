// components/shared/product/ImageSlider.tsx
"use client"

import { useState } from 'react';
import type { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IProductImage } from '@/models/Product';
import { Expand, ChevronLeft, ChevronRight } from 'lucide-react';

// Import all necessary Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import 'swiper/css/zoom';

interface ImageSliderProps {
  images: IProductImage[];
  discount: number;
}

const ImageSlider = ({ images, discount }: ImageSliderProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // A fallback UI in case there are no images, preventing errors.
  if (!images || images.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No Image Available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full gap-3 h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] relative"
    >
      {/* Main Image Viewer (Left Side - 80% width) */}
      <div className="w-4/5 h-full relative group">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs, Zoom]}
          className="mySwiper2 w-full h-full rounded-xl bg-gray-100 shadow-sm border border-gray-200 overflow-hidden"
          zoom={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="swiper-zoom-container relative w-full h-full">
                <Image
                  fill
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 60vw"
                  priority={index === 0}
                  onDoubleClick={() => setZoomEnabled(!zoomEnabled)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Discount Badge */}
        {discount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg"
          >
            -{discount}% OFF
          </motion.span>
        )}

        {/* Custom Navigation Arrows */}
        <button className="custom-prev absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button className="custom-next absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Zoom Indicator */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setZoomEnabled(!zoomEnabled)}
          className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title={zoomEnabled ? "Disable zoom" : "Enable zoom"}
        >
          <Expand className="w-4 h-4 text-gray-700" />
        </motion.button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery Slider (Right Side - 20% width) */}
      <div className="w-1/5 h-full">
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          direction="vertical"
          spaceBetween={10}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          className="mySwiperThumbs h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent transition-all duration-300 hover:border-blue-500 swiper-slide-thumb-active:border-blue-500 swiper-slide-thumb-active:shadow-md"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-full h-full bg-gray-100"
              >
                <Image
                  fill
                  src={image.url}
                  alt={`Product thumbnail ${index + 1}`}
                  className="object-cover"
                  sizes="20vw"
                />
                {index === activeIndex && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg"
                  />
                )}
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setFullscreen(false)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Image
                src={images[activeIndex].url}
                alt={`Product image ${activeIndex + 1}`}
                width={800}
                height={600}
                className="object-contain rounded-lg"
              />
              <button
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                onClick={() => setFullscreen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .mySwiper2 {
          border-radius: 12px;
        }
        
        .mySwiperThumbs {
          border-radius: 8px;
        }
        
        .mySwiperThumbs .swiper-slide {
          height: calc(25% - 10px) !important;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }
        
        .mySwiperThumbs .swiper-slide-thumb-active {
          opacity: 1;
        }
        
        .swiper-zoom-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </motion.div>
  );
}

export default ImageSlider;