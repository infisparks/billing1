"use client";

import Image from "next/image";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import TestimonialImg1 from "../../../../public/img/testi1.png";
import TestimonialImg2 from "../../../../public/img/testi2.png";
import TestimonialImg3 from "../../../../public/img/testi3.png";

export default function Sliders() {
  const [testimonialSlider, settestimonialSlider] = useState([
    {
      id: "slider1",
      img: TestimonialImg1,
      desc: "Lorem ipsum dolor sit amet consectetur eliet adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
      name: "Ruhfayed Sakib",
    },
    {
      id: "slider2",
      img: TestimonialImg2,
      desc: "Lorem ipsum dolor sit amet consectetur eliet adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
      name: "Shakil Hossain",
    },
    {
      id: "slider3",
      img: TestimonialImg3,
      desc: "Lorem ipsum dolor sit amet consectetur eliet adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
      name: "Naimur Rahman",
    },
    {
      id: "slider4",
      img: TestimonialImg2,
      desc: "Lorem ipsum dolor sit amet consectetur eliet adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
      name: "Shakil Hossain",
    },
    {
      id: "slider5",
      img: TestimonialImg3,
      desc: "Lorem ipsum dolor sit amet consectetur eliet adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
      name: "Naimur Rahman",
    },
  ]);

  return (
    <>
      <Swiper
        slidesPerView={3}
        spaceBetween={0}
        loop={true}
        centeredSlides={true}
        autoplay={{ delay: 4000 }}
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
        }}
        className="testimonial-slider"
        breakpoints={{
          360: {
            slidesPerView: 1,
            loop: false,
          },
          576: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1170: {
            slidesPerView: 3,
          },
        }}
      >
        {testimonialSlider.map((singleSlider) => (
          <SwiperSlide className="single-testimonial" key={singleSlider.id}>
            <Image src={singleSlider.img} alt="#" width={53} height={53} />
            <p>{singleSlider.desc}</p>
            <h4 className="name">{singleSlider.name}</h4>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
