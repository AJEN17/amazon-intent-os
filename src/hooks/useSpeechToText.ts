// src/hooks/useSpeechToText.ts
import { useState, useEffect, useRef } from 'react';

export const useSpeechToText = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = "en-IN"; 
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      rec.onend = () => setIsListening(false);
      
      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setError("Microphone access denied. Please enable it in your browser settings.");
        } else {
          setError(`Microphone error: ${event.error}`);
        }
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResultRef.current(text);
      };

      setRecognition(rec);
    } else {
      setError("Voice search is not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return { isListening, error, toggleListening, setError };
};
