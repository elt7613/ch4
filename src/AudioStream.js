import { useEffect, useState } from "react";

const AudioStream = ({ text }) => {
  const [voicesLoaded, setVoicesLoaded] = useState(false); // Track if voices are loaded

  useEffect(() => {
    const synth = window.speechSynthesis;

    // Function to handle speaking the text
    const speakText = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();

      if (voices.length > 0) {
        // Choose a specific voice if needed, or just use the default
        utterance.voice = voices[7]; // Example: Using the second voice available
      }

      synth.speak(utterance);
    };

    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech before starting new
      synth.cancel();

      // Check if voices are already loaded
      if (synth.getVoices().length > 0) {
        setVoicesLoaded(true);
        speakText(); // Voices are ready, speak immediately
      } else {
        // Add listener for when voices are loaded
        synth.onvoiceschanged = () => {
          setVoicesLoaded(true);
          speakText(); // Voices are now loaded, speak the text
        };
      }
    } else {
      console.error('Speech Synthesis not supported in this browser.');
    }

    // Cleanup on unmount or when text changes
    return () => {
      synth.cancel();
    };
  }, [text]);

  return null; // No UI needed, just automatic speech
};

export default AudioStream;

