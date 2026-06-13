// src/components/crisis/VoiceTranscriber.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCrisisStore } from "@/store/useCrisisStore";
import { Mic, MicOff, Loader2, Search, SendHorizontal } from "lucide-react";

export default function VoiceTranscriber() {
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);
  const isLoading = useCrisisStore((state) => state.isLoading);
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      // Locked strictly to Indian English to respect local accents without Hindi translation
      rec.lang = "en-IN"; 
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      
      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please enable it in your browser settings.");
        }
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processIntent(text);
      };

      setRecognition(rec);
    }
  }, [triggerCrisis]);

  const processIntent = async (text: string) => {
    if (!text.trim()) return;
    
    // Set UI to loading state
    useCrisisStore.setState({ isLoading: true });

    try {
      // 1. Send the actual network request to our Advanced API
      const response = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process intent");
      }

      // 2. Trigger the UI Drawer using the real AI-generated categories
      triggerCrisis(data.macro_crisis, data.target_category);

    } catch (error) {
      console.error("Failed to route intent:", error);
      alert("AI Processing Failed. Please try again or ensure AWS credentials are set.");
      useCrisisStore.setState({ isLoading: false });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processIntent(transcript);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice search is not supported in this browser. Please use Google Chrome or type your search.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript("");
      recognition.start();
    }
  };

  return (
    <div className="w-full px-4 mb-8">
      <form 
        onSubmit={handleManualSubmit}
        className={`relative flex items-center w-full bg-white border shadow-sm rounded-2xl overflow-hidden transition-all duration-200 ${
          isListening ? "border-amber-400 ring-2 ring-amber-400/20" : "border-neutral-200 focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900"
        }`}
      >
        <div className="pl-4 text-neutral-400">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Search or tap mic to speak..."
          disabled={isLoading}
          className="flex-1 w-full py-4 px-3 text-sm text-neutral-900 bg-transparent outline-none placeholder:text-neutral-400"
        />

        {/* Action Buttons Container */}
        <div className="flex items-center pr-2 gap-1">
          {/* Send Button */}
          {transcript.length > 0 && !isListening && (
            <button 
              type="submit"
              disabled={isLoading}
              className="p-2 text-neutral-900 hover:text-amber-600 transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizontal className="w-5 h-5" />}
            </button>
          )}

          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
              isListening ? "text-amber-500 bg-amber-50 animate-pulse" : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {isLoading && !isListening ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : (
              isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {isListening && (
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest text-center mt-3 animate-pulse">
          Listening...
        </p>
      )}
    </div>
  );
}