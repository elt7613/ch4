import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CSS/navbar.css';
import logo from './Files/logo.png';
import axios from 'axios';
import AudioStream from './AudioStream';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const API_URL = 'http://0.0.0.0:5000/chat';
const ELEVENLABS_API_KEY = "sk_11133c8d64c9b9633c566d1acef826fcdf97534374bc58d0";
const VOICE_ID = "pqHfZKP75CvOlQylNhV4";
const VOICE_SETTINGS = {
  stability: 1,
  similarity_boost: 1,
  style: 1 
};

const NavBar = () => {
  const [messages, setMessages] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const audioRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { 
      'Content-Type': 'application/json',
      "API-Key": "random"
    }
  });

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    
    try {
      setMessages(prev => [...prev, { text, isUser: true }]);
      const response = await axiosInstance.post('', { text });
      const aiMessage = response.data.answer;
      setMessages(prev => [...prev, { text: aiMessage, isUser: false, audio: true }]);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [axiosInstance]);

  // Function to handle speech recognition
  const handleSpeechRecognition = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (transcript) {
        // Check if 'CH4' (case insensitive) is in the transcript
        if (transcript.toLowerCase().includes('ch4')) {
          console.log('CH4 detected in:', transcript);
          sendMessage(transcript);
        } else {
          console.log('CH4 not found in : ', transcript);
        }
        resetTranscript();
      }
    }, 2000);
  }, [transcript, sendMessage, resetTranscript]);

  // Start/stop listening
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
    }

    return () => {
      SpeechRecognition.stopListening();
      setIsListening(false);
    };
  }, [browserSupportsSpeechRecognition]);

  // Handle transcript changes
  useEffect(() => {
    if (isListening && transcript) {
      handleSpeechRecognition();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [transcript, isListening, handleSpeechRecognition]);


  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="navbar">
        <img src={logo} alt="Logo" className='logo'/>
        <div className="ai-talk">
          <div className="btn-container">
            <svg xmlns="http://www.w3.org/2000/svg" className='btn-svg' version="1.1">
              <defs>
                <filter id="gooey">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="highContrastGraphic" />
                  <feComposite in="SourceGraphic" in2="highContrastGraphic" operator="atop" />
                </filter>
              </defs>
            </svg>
            <button id="gooey-button" onClick={handleButtonClick}>
              <div className="chat-container">
                
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.isUser ? 'user' : 'ai'}`}>
                    {message.audio && (
                      <AudioStream
                        
                        text={message.text}
                        
                      />
                    )}
                  </div>
                ))}
              </div>
              Say, Hi! CH4
              <span className="bubbles">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="bubble"></span>
                ))}
              </span>
            </button>

            <svg xmlns="http://www.w3.org/2000/svg" className='robo-icon' width="39" height="39" viewBox="0 0 24 24">
              <path fill="white" d="M22.078 8.347a1.4 1.4 0 0 0-.488-.325V4.647a.717.717 0 1 0-1.434 0V7.85h-.21a5.48 5.48 0 0 0-5.25-3.92H9.427a5.48 5.48 0 0 0-5.25 3.92H3.9V4.647a.717.717 0 1 0-1.434 0v3.385a1.5 1.5 0 0 0-.469.315A1.72 1.72 0 0 0 1.5 9.552v4.896a1.7 1.7 0 0 0 1.702 1.702h.956a5.48 5.48 0 0 0 5.25 3.92h5.183a5.48 5.48 0 0 0 5.25-3.92h.955a1.7 1.7 0 0 0 1.702-1.702V9.552c.02-.44-.131-.872-.42-1.205M3.996 14.716H3.24a.27.27 0 0 1-.191-.077a.3.3 0 0 1-.076-.191V9.552a.26.26 0 0 1 .248-.268h.775a.6.6 0 0 0 0 .125v5.182a.6.6 0 0 0 0 .125m4.695-3.118a.813.813 0 0 1-1.386-.578c0-.217.086-.425.238-.579l.956-.956a.813.813 0 0 1 1.148 0l.956.956a.812.812 0 0 1-.574 1.387a.8.8 0 0 1-.573-.23l-.412-.41zm5.9 4.074a3.605 3.605 0 0 1-5.068 0a.813.813 0 0 1 .885-1.326a.8.8 0 0 1 .262.178a2.017 2.017 0 0 0 2.773 0a.804.804 0 0 1 1.148 0a.813.813 0 0 1 0 1.148zm1.912-4.074a.813.813 0 0 1-1.148 0l-.41-.41l-.402.41a.82.82 0 0 1-.574.23a.8.8 0 0 1-.574-.23a.82.82 0 0 1 0-1.157l.957-.956a.813.813 0 0 1 1.147 0l.956.956a.82.82 0 0 1 .077 1.157zm4.609 2.869a.3.3 0 0 1-.077.191a.27.27 0 0 1-.191.077h-.755a.6.6 0 0 0 0-.125V9.37a.6.6 0 0 0 0-.124h.765a.25.25 0 0 1 .181.077c.049.052.076.12.077.19z" />
            </svg>
          </div>
        </div>
      </div>
                 
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Talk to our AI!</h2>
            <p>You can talk to our AI just by mentioning its name whenever you want. For example, you can ask: "What is this project about CH4?"</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
