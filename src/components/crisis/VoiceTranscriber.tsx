// src/components/crisis/VoiceTranscriber.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useCrisisStore } from "@/store/useCrisisStore";
import { Mic, MicOff, Loader2 } from "lucide-react";

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
      rec.lang = "en-IN"; 
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        
        if (text.toLowerCase().includes("power") || text.toLowerCase().includes("charger")) {
          triggerCrisis("POWER_CUT_CRISIS", "power_bank");
        } else {
          triggerCrisis("PARTY_CRISIS", "soft_drinks");
        }
      };

      setRecognition(rec);
    }
  }, [triggerCrisis]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript("");
      recognition.start();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm mt-6 text-center">
      <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">
        Or State Your Situation
      </p>
      
      <div className="min-h-[40px] flex items-center justify-center px-4 mb-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            Assembling Outcome Bundle...
          </div>
        ) : (
          <p className="text-neutral-700 font-medium text-sm italic">
            {transcript || '"Guests just arrived, out of drinks..."'}
          </p>
        )}
      </div>

      <button
        onClick={toggleListening}
        disabled={isLoading}
        className={`mx-auto p-5 rounded-full shadow-md transition-all duration-300 active:scale-95 ${
          isListening 
            ? "bg-red-500 text-white animate-pulse" 
            : "bg-neutral-900 text-white hover:bg-neutral-800"
        } disabled:bg-neutral-200 disabled:text-neutral-400`}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>
    </div>
  );
}