import React, { useState } from 'react';
import '../CSS/chapters/chapter_1.css'; // Correct path to the CSS file
import '../CSS/chapters/SectionSlider.css'; // Correct path to the SectionSlider.css file
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import chapter1_bg from '../Files/Chapters/chapter1_bg.jpg';

import chapter1_image1 from '../Files/Chapters/chatpter_1/chapter1_image1.png';
import chapter1_image2 from '../Files/Chapters/chatpter_1/chapter1_image2.png';
import chapter1_image3 from '../Files/Chapters/chatpter_1/chapter1_image3.png';
import chapter1_image4 from '../Files/Chapters/chatpter_1/chapter1_image4.png';
import chapter1_image5 from '../Files/Chapters/chatpter_1/chapter1_image5.png';
import chapter1_image6 from '../Files/Chapters/chatpter_1/chapter1_image6.png';
import chapter1_image7 from '../Files/Chapters/chatpter_1/chapter1_image7.png';
import chapter1_image8 from '../Files/Chapters/chatpter_1/chapter1_image8.png';
import chapter1_image9 from '../Files/Chapters/chatpter_1/chapter1_image9.png';
import chapter1_image10 from '../Files/Chapters/chatpter_1/chapter1_image10.png';
import chapter1_image11 from '../Files/Chapters/chatpter_1/chapter1_image11.png';

const Chapter1 = () => {
  const images = [
    chapter1_image1, 
    chapter1_image2, 
    chapter1_image3,
    chapter1_image4,
    chapter1_image5,
    chapter1_image6,
    chapter1_image7,
    chapter1_image8,
    chapter1_image9,
    chapter1_image10,
    chapter1_image11,
]; 

  const [currentIndex, setCurrentIndex] = useState();//localhost:3000/chapter-1tate(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Fullscreen centered image with black background */}
      {/* <div className="fullscreen-image-container">
        <img src={chapter1_bg} alt="Centered Image" className="centered-image" />
      </div> */}

      {/* Section 02 with slider */}
      <section className="chapter-1-section-1">
        <div className="bg-image">
          <img src={chapter1_bg} alt="Background Image"/>
        </div>
      </section>

      <section className='chapter-1-section-2'>
          <h1 className="header">Chapter 1</h1>
          <div className="manga-swiper">
            <Swiper navigation={true} modules={[Navigation]} className="swiper">
              <SwiperSlide><img src={chapter1_image1}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image2}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image3}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image4}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image5}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image6}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image7}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image8}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image9}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image10}/></SwiperSlide>
              <SwiperSlide><img src={chapter1_image11}/></SwiperSlide>

            </Swiper>
          </div>

          <div className="test-manga-panel">
          <img src={chapter1_image1}/>
          <img src={chapter1_image2}/>
          <img src={chapter1_image3}/>
          <img src={chapter1_image4}/>
          <img src={chapter1_image5}/>
          <img src={chapter1_image6}/>
          <img src={chapter1_image7}/>
          <img src={chapter1_image8}/>
          <img src={chapter1_image9}/>
          <img src={chapter1_image10}/>
          <img src={chapter1_image11}/>
          </div>
</section>

    </>
  );
};

export default Chapter1;
