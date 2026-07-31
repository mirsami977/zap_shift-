

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import amazon from "../../../assets/brands/amazon_vector.png";
import ama from "../../../assets/brands/amazon.png";
import casio from "../../../assets/brands/casio.png";
import moon from "../../../assets/brands/moonstar.png";
import rand from "../../../assets/brands/randstad.png";
import star from "../../../assets/brands/star.png";
import starp from "../../../assets/brands/start_people.png";
const brandImages = [amazon, ama, casio, moon, rand, star, starp];
const Brands = () => {
  return (
    <Swiper
      loop={true}
          slidesPerView={4}
           centeredSlides={true}
      spaceBetween={30}
      autoplay={{
        delay: 1000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      grabCursor={true}
     
      >
     {brandImages.map((logo,index )=> <SwiperSlide key={index}><img src={logo} alt="" /></SwiperSlide>)}
     
    
    </Swiper>
  );
};

export default Brands;
