import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CSS/navbar.css';
import logo from './Files/logo.png';
import axios from 'axios';
import AudioStream from './AudioStream';

const API_URL = 'http://0.0.0.0:5000/chat';
const ELEVENLABS_API_KEY = "sk_7b58e11a07166ebb62ce67cf8b2bf37494b5ca7ce0e56f3a";
const VOICE_ID = "pqHfZKP75CvOlQylNhV4";
const VOICE_SETTINGS = {
  stability: 1,
  similarity_boost: 1,
  style: 1 
};

const NavBar = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const isRecognizingRef = useRef(false);

  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { 
      'Content-Type': 'application/json',
      "API-Key": localStorage.getItem("userToken")
    }
  });

  const handleSpeechResult = useCallback((event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    if (event.results[0].isFinal) {
      if (transcript.toLowerCase().includes('ch4')) {
        const question = transcript.replace(/ch4/i, '').trim();
        sendMessage(question);
      }
      if (isRecognizingRef.current) {
        recognitionRef.current.stop();
        isRecognizingRef.current = false;
      }
    }
  }, []);

  const handleSpeechError = useCallback((event) => {
    setIsListening(false);
    if (!isRecognizingRef.current) {
      try {
        recognitionRef.current.start();
        isRecognizingRef.current = true;
      } catch (err) {
        console.error("Error restarting speech recognition after error:", err.message);
      }
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = () => {
        isRecognizingRef.current = false;
        if (isListening) {
          setTimeout(() => {
            if (!isRecognizingRef.current) {
              try {
                recognitionRef.current.start();
                isRecognizingRef.current = true;
              } catch (err) {
                console.error("Error restarting speech recognition:", err.message);
              }
            }
          }, 500);
        }
      };
    }

    if (isListening && !isRecognizingRef.current) {
      try {
        recognitionRef.current.start();
        isRecognizingRef.current = true;
      } catch (err) {
        console.error("Error starting speech recognition:", err.message);
      }
    }

    return () => {
      if (recognitionRef.current && isRecognizingRef.current) {
        recognitionRef.current.stop();
        isRecognizingRef.current = false;
      }
    };
  }, [isListening, handleSpeechResult, handleSpeechError]);

  const sendMessage = useCallback(async (text) => {
    try {
      setMessages(prev => [...prev, { text, isUser: true }]);
      
      const response = await axiosInstance.post('', { text });
      const aiMessage = response.data.answer;
      
      setMessages(prev => [...prev, { text: aiMessage, isUser: false, audio: true }]);
    } catch (error) {
      console.error('Error:', error);
    } 
  }, [axiosInstance]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [messages]);

  const handleButtonClick = () => {
    setShowPopup(true); // Show the popup on button click
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };

  return (
    <>
      <div className="navbar">
        <img src={logo} className='logo'/>

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
                        ref={audioRef}
                        voiceId={VOICE_ID}
                        text={message.text}
                        apiKey={ELEVENLABS_API_KEY}
                        voiceSettings={VOICE_SETTINGS}
                      />
                    )}
                  </div>
                ))}
              </div>
              Say, Hi! CH4
              <span className="bubbles">
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
                <span className="bubble"></span>
              </span>
            </button>

            {/* Robo icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className='robo-icon' width="39" height="39" viewBox="0 0 24 24">
            	<path fill="white" d="M22.078 8.347a1.4 1.4 0 0 0-.488-.325V4.647a.717.717 0 1 0-1.434 0V7.85h-.21a5.48 5.48 0 0 0-5.25-3.92H9.427a5.48 5.48 0 0 0-5.25 3.92H3.9V4.647a.717.717 0 1 0-1.434 0v3.385a1.5 1.5 0 0 0-.469.315A1.72 1.72 0 0 0 1.5 9.552v4.896a1.7 1.7 0 0 0 1.702 1.702h.956a5.48 5.48 0 0 0 5.25 3.92h5.183a5.48 5.48 0 0 0 5.25-3.92h.955a1.7 1.7 0 0 0 1.702-1.702V9.552c.02-.44-.131-.872-.42-1.205M3.996 14.716H3.24a.27.27 0 0 1-.191-.077a.3.3 0 0 1-.076-.191V9.552a.26.26 0 0 1 .248-.268h.775a.6.6 0 0 0 0 .125v5.182a.6.6 0 0 0 0 .125m4.695-3.118a.813.813 0 0 1-1.386-.578c0-.217.086-.425.238-.579l.956-.956a.813.813 0 0 1 1.148 0l.956.956a.812.812 0 0 1-.574 1.387a.8.8 0 0 1-.573-.23l-.412-.41zm5.9 4.074a3.605 3.605 0 0 1-5.068 0a.813.813 0 0 1 .885-1.326a.8.8 0 0 1 .262.178a2.017 2.017 0 0 0 2.773 0a.804.804 0 0 1 1.148 0a.813.813 0 0 1 0 1.148m1.912-4.074a.813.813 0 0 1-1.148 0l-.41-.41l-.402.41a.82.82 0 0 1-.574.23a.8.8 0 0 1-.574-.23a.82.82 0 0 1 0-1.157l.957-.956a.813.813 0 0 1 1.147 0l.956.956a.82.82 0 0 1 .077 1.157zm4.609 2.869a.3.3 0 0 1-.077.191a.27.27 0 0 1-.191.077h-.755a.6.6 0 0 0 0-.125V9.37a.6.6 0 0 0 0-.124h.765a.25.25 0 0 1 .181.077c.049.052.076.12.077.19z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Popup Component */}
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

