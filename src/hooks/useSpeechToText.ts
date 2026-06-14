// src/hooks/useSpeechToText.ts
import { useState, useEffect, useRef } from 'react';

// Minimal types to replace 'any'
interface SpeechRecognitionEvent {
  results: { transcript: string }[][];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

export const useSpeechToText = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref instead of state to prevent infinite cascading re-renders
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const rec = new SpeechRecognition() as ISpeechRecognition;
      rec.continuous = false;
      rec.lang = "en-IN"; 
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      rec.onend = () => setIsListening(false);
      
      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setError("Microphone access denied. Please enable it in your browser settings.");
        } else {
          setError(`Microphone error: ${event.error}`);
        }
      };

      rec.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        onResultRef.current(text);
      };

      recognitionRef.current = rec;
    } else {
      setTimeout(() => {
        setError("Voice search is not supported in this browser.");
      }, 0);
    }
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        // Handle case where recognition is already started
        console.error("Failed to start recognition:", e);
      }
    }
  };

  return { isListening, error, toggleListening, setError };
};
