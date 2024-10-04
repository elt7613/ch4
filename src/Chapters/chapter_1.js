import React, { useState } from 'react';
import '../CSS/chapters/chapter_1.css'; // Correct path to the CSS file
import '../CSS/chapters/SectionSlider.css'; // Correct path to the SectionSlider.css file

// Import the images from the src/Chapters directory
import image1 from './image1.jpg';
import image2 from './image3.jpg';
import image3 from './image1.jpg';
import chapter1_bg from '../Files/Chapters/chapter1_bg.jpg'

const Chapter1 = () => {
  const images = [image1, image2, image3]; // Use the imported images

  const [currentIndex, setCurrentIndex] = useState(0);

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
      <section className="chapter-1-section">
        <div className="bg-image">
          <img src={chapter1_bg} alt="Background Image"/>
        </div>

        <div className='chapter'>
          <h1 className="header1">Chapter 1</h1>
          <div className="slider-container">
            {currentIndex > 0 && (
              <button className="slider-button prev-button" onClick={handlePrev}>
                &#8592; {/* Left arrow */}
              </button>
            )}

            <div className="image-slider">
              <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} className="slider-image" />
            </div>
          
            {currentIndex < images.length - 1 && (
              <button className="slider-button next-button" onClick={handleNext}>
                &#8594; {/* Right arrow */}
              </button>
            )}
          </div>
          </div>
</section>

    </>
  );
};

export default Chapter1;
