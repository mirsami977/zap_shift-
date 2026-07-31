
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import REviewCard from "./REviewCard";
import pix from "../../../../assets/customer-top.png"
const Reviews = ({ reviews = [] }) => {
  return (
    <div>
      <>
        <div className="flex flex-col items-center justify-center text-center px-4 py-8">
      {/* Top Illustration/Image */}
      <div className="mb-4">
        <img
          src={pix}
          alt="Illustration"
          className="w-28 md:w-36 h-auto mx-auto"
        />
      </div>

      {/* Main Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#024950] mb-3 tracking-tight">
        What our customers are sayings
      </h2>

      {/* Description Paragraph */}
      <p className="max-w-xl text-xs md:text-sm text-gray-500 leading-relaxed">
        Enhance posture, mobility, and well-being effortlessly with Posture Pro. 
        Achieve proper alignment, reduce pain, and strengthen your body with ease!
      </p>
    </div>
        <Swiper
          loop={true}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination,Autoplay]}
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review._id || review.id}>
              <REviewCard review={review}></REviewCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    </div>
  );
};

export default Reviews;
