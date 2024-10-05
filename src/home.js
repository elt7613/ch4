import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CSS/home.css';
import { useNavigate } from 'react-router-dom';
import poster from './Files/home/chapters/poster.jpg';
import poster2 from './Files/home/chapters/poster2.webp';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import axios from 'axios';
import AudioStream from './AudioStream';

import audio1 from './Files/home/characterInfo/audio1.mp3';
import audio2 from './Files/home/characterInfo/audio2.mp3';
import audio3 from './Files/home/characterInfo/audio3.mp3';
import NavBar from './nav';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();

  //========== CHARACTER INFO FUNCTIONS =========================
    // Refs for audio elements
    const audioRefs = useRef([new Audio(audio1), new Audio(audio2), new Audio(audio3)]);

    // State to keep track of active slide and user interaction
    const [activeIndex, setActiveIndex] = useState(0);
    const [userInteracted, setUserInteracted] = useState(false); // Track user interaction

    // Handle user interaction (click or touch)
    const handleUserInteraction = () => {
        if (!userInteracted) {
            setUserInteracted(true);
        }
    };

    // Handle slide change
    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
    };

    useEffect(() => {
        if (userInteracted) {
            // Stop all audios when activeIndex changes
            audioRefs.current.forEach((audio, index) => {
                if (index === activeIndex) {
                    audio.play().catch((error) => console.log('Play prevented: ', error)); // Catch the play error gracefully
                } else {
                    audio.pause();
                    audio.currentTime = 0;  // Reset audio to the beginning
                }
            });
        }

        return () => {
            // Cleanup: pause all audios when the component is unmounted
            audioRefs.current.forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, [activeIndex, userInteracted]);

    const redirectChapter1 = () => {
      navigate("/chapter-1");
    }

    return (
        <>
        <NavBar/>
        <section className='section-1' onClick={handleUserInteraction} onTouchStart={handleUserInteraction}>
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
          onSlideChange={handleSlideChange}  // Event to handle slide change
        >
            {/* Info card 1 */}
            <SwiperSlide>
            <div className="info-card-1">
              <div className="info-card portfolio-card">
                <div className="image-container info-1">
                  <div className="inner-card">
                    <div className="empty-space-1"></div>
                    <div className="empty-space-2"></div>
                    <span className='character-name'>Hiroshima</span><br/>
                    <span className='about-character'>
                      Nice, Cute, Handsome
                    </span>
                  </div>
                </div>
                <div className="empty-space"></div>
              </div>
            </div>
            </SwiperSlide>

            {/* Info card 2 */}
            <SwiperSlide>
            <div className="info-card-2">
              <div className="info-card portfolio-card">
                <div className="image-container info-2">
                  <div className="inner-card">
                    <div className="empty-space-1"></div>
                    <div className="empty-space-2"></div>
                    <span className='character-name'>Kshwydv</span><br/>
                    <span className='about-character'>
                      Good, Ok, Yo
                    </span>
                  </div>
                </div>
                <div className="empty-space"></div>
              </div>
            </div>
            </SwiperSlide>

            {/* Info card 3 */}
            <SwiperSlide>
            <div className="info-card-3">
              <div className="info-card portfolio-card">
                <div className="image-container info-3">
                  <div className="inner-card">
                    <div className="empty-space-1"></div>
                    <div className="empty-space-2"></div>
                    <span className='character-name'>Yuodmsrf</span><br/>
                    <span className='about-character'>
                      Bad Ass,
                    </span>
                  </div>
                </div>
                <div className="empty-space"></div>
              </div>
            </div>
            </SwiperSlide>
        </Swiper>

        </section>


      {/* ========= Section 2 Chapter Cards ========================= */}
        <section className='section-2'>
          <h1 className='header'>
            Chapters
          </h1>
          
          <div className="chapter-card chap-card-1" onClick={redirectChapter1}>
            <img src={poster} alt="Image 1" className="card-image" />
            <div className="card-content">
              <h2 className='title'>Deforestation</h2>
              <p className='description'>Description for card 1 goes here.
                Description for card 1 goes here.sjnc fe dudoo wdwdj ddud wdqwud d
                Description for card 1 goes here.wkdjqpdu qqjp uhqoifj  
              </p>
            </div>
          </div>

          <div className="chapter-card chap-card-2">
            <img src={poster2} alt="Image 1" className="card-image" />
            <div className="card-content">
              <h2 className='title'>Afforestation</h2>
              <p className='description'>Description for card 1 goes here.
                Description for card 1 goes here.sjnc fe dudoo wdwdj ddud wdqwud d
                Description for card 1 goes here.wkdjqpdu qqjp uhqoifj  
              </p>
            </div>
          </div>

          <div className="chapter-card chap-card-3">
            <img src={poster} alt="Image 1" className="card-image" />
            <div className="card-content">
              <h2 className='title'>Keforestation</h2>
              <p className='description'>Description for card 1 goes here.
                Description for card 1 goes here.sjnc fe dudoo wdwdj ddud wdqwud d
                Description for card 1 goes here.wkdjqpdu qqjp uhqoifj  
              </p>
            </div>
          </div>
        </section>


        {/* ========= Section 3 Footer ========================= */}

        <Footer/>
        </>
    );
};

export default Home;
