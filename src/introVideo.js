import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/introVideo.css';
import introVideo from "./Files/introVideo.mp4";

const IntroVideo = () => {
  const [showButton, setShowButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [name, setName] = useState('');
  const [token, setToken] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!showPopup && token) {
      const video = videoRef.current;
      if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.log("Autoplay was prevented:", error);
              setIsPlaying(false);
            });
        }

        const handleTimeUpdate = () => {
          const timeLeft = video.duration - video.currentTime;
          setShowButton(timeLeft <= 3 || video.ended);
        };

        const handleEnded = () => {
          setIsPlaying(false);
          setShowButton(true);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);

        return () => {
          video.removeEventListener('timeupdate', handleTimeUpdate);
          video.removeEventListener('ended', handleEnded);
        };
      }
    }
  }, [showPopup, token]);

  const handleButtonClick = () => {
    navigate('/home');
  };

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (video) {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user-login/',
         { "username": name }
        );
      setToken(response.data.Token);
      // Store the token in localStorage or a state management solution if needed
      localStorage.setItem('userToken', response.data.Token);
      localStorage.setItem('username',name);
      console.log(response.data.Token);
      setShowPopup(false);
    } catch (error) {
      console.error('Error fetching token:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="video-container">
      {showPopup ? (
        <div className="username-popup">
          <div className="popup-content">
            <h2 className='title'>Enter Your Name</h2>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
              <button type="submit">Proceed</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="fullscreen-video"
          >
            <source src={introVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="button-overlay">
            {!isPlaying && !showButton && (
              <button
                className="play-button"
                onClick={handlePlayClick}
              >
                Start The Journey
              </button>
            )}
            {showButton && (
              <button className="Btn-Container" onClick={handleButtonClick}>
                <span className="text">Move To Chapters!</span>
                <span className="icon-Container">
                  <svg
                    width="16"
                    height="19"
                    viewBox="0 0 16 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="1.61321" cy="1.61321" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="1.61321" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="5.5566" r="1.5" fill="black"></circle>
                    <circle cx="9.85851" cy="5.5566" r="1.5" fill="black"></circle>
                    <circle cx="9.85851" cy="9.5" r="1.5" fill="black"></circle>
                    <circle cx="13.9811" cy="9.5" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="13.4434" r="1.5" fill="black"></circle>
                    <circle cx="9.85851" cy="13.4434" r="1.5" fill="black"></circle>
                    <circle cx="1.61321" cy="17.3868" r="1.5" fill="black"></circle>
                    <circle cx="5.73583" cy="17.3868" r="1.5" fill="black"></circle>
                  </svg>
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default IntroVideo;