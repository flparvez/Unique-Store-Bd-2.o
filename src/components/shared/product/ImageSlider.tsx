"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { IProductImage } from '@/models/Product';



const ImageSlider = ({images, discount}:{images:IProductImage[], discount:number}) => {
    return (
        <div className=" product-image-slider">
        <Swiper
          parallax={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            0: { slidesPerView: 1 }, // For very small screens
            
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image width={1000} height={100} src={image.url} alt={`Product ${index + 1}`} className="w-full h-auto object-cover" />
           {
             discount ?  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
             {discount}% OFF
           </span> : null
           }
  
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
}

export default ImageSlider
