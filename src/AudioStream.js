import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AudioStream = ({ voiceId, text, apiKey, voiceSettings }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null); // Reference to the audio element
  const audioUrlRef = useRef(null); // To store the audio URL if autoplay fails

  useEffect(() => {
    if (text && voiceId && apiKey) {
      startStreaming();
    }
  }, [text, voiceId, apiKey]); // Automatically stream when dependencies change

  // Attach minimal user interaction listeners to retry playback if autoplay fails
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioUrlRef.current && audioRef.current) {
        // Try to play the audio again after user interaction
        audioRef.current.play().catch((e) => {
          console.error("Playback failed again after interaction: ", e);
        });
      }
      // Remove listeners once interaction occurs
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
    };

    // Add listeners for minimal user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("scroll", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("scroll", handleUserInteraction);
    };
  }, []);

  const startStreaming = async () => {
    if (loading) return; // Prevent multiple requests while loading

    setLoading(true);
    setError("");

    const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
    const headers = {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    };

    const requestBody = {
      text,
      voice_settings: voiceSettings, // Stability and similarity boost settings
    };

    try {
      const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
        headers,
        responseType: "blob", // Expect audio data as a blob
      });

      if (response.status === 200) {
        const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioUrlRef.current = audioUrl; // Store audio URL for later playback if needed

        if (audioRef.current) {
          audioRef.current.pause(); // Stop any previously playing audio
          URL.revokeObjectURL(audioRef.current.src); // Clean up the old URL
        }

        audioRef.current = new Audio(audioUrl); // Create a new audio instance

        // Try to autoplay
        audioRef.current.play().catch((error) => {
          console.warn("Autoplay blocked: ", error);
          setError("Autoplay failed. User interaction is required to play audio.");
        });

        audioRef.current.onended = () => {
          audioRef.current = null; // Clean up the reference when audio ends
        };
      } else {
        setError("Error: Unable to stream audio. Unexpected response.");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      setError(`Error: Unable to stream audio. ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading audio...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AudioStream;
