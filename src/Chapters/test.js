import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../CSS/chapters/test.css";
import image1 from './image1.jpg';
import image2 from './image2.jpeg';
import image3 from './image3.jpg';

export default function App() {
  // Array of image URLs
  const images = [
    image1,
    image2,
    image3
  ];

  return (
    <>
      <br />
      <div className="manga-slider">
        <Swiper watchSlidesProgress={true} slidesPerView={3} className="mySwiper">
          {images.map((image, index) => (
            <SwiperSlide key={index} style={{ backgroundImage: `url(${image})` }}>
              Slide {index + 1}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
