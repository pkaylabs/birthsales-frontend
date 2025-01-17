import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const SwiperExample: React.FC = () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination]}
    >
      <SwiperSlide>
        <img src="https://via.placeholder.com/600x300?text=Slide+1" alt="Slide 1" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/600x300?text=Slide+2" alt="Slide 2" />
      </SwiperSlide>
      <SwiperSlide>
        <img src="https://via.placeholder.com/600x300?text=Slide+3" alt="Slide 3" />
      </SwiperSlide>
    </Swiper>
  );
};

export default SwiperExample;
