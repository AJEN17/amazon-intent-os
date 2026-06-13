// src/components/crisis/VoiceTranscriber.tsx
"use client";

import React, { useState } from "react";
import { useCrisisStore, CrisisCategory } from "@/store/useCrisisStore";
import { useSystemStore } from "@/store/useSystemStore";
import { Mic, MicOff, Loader2, Search, SendHorizontal, AlertCircle, Scan } from "lucide-react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function VoiceTranscriber() {
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);
  const isLoading = useCrisisStore((state) => state.isLoading);
  const setSearchFocused = useSystemStore((state) => state.setSearchFocused);
  
  const [transcript, setTranscript] = useState("");

  const processIntent = async (text: string) => {
    if (!text.trim()) return;
    
    setTranscript(text);
    useCrisisStore.setState({ isLoading: true });

    try {
      const response = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process intent");
      }

      triggerCrisis(data.macro_crisis as CrisisCategory, data.target_category, true);
      setSearchFocused(false); // Close suggestions on successful search
    } catch (error) {
      console.error("Failed to route intent:", error);
      setError("AI Processing Failed. Please try again or ensure AWS credentials are set.");
      useCrisisStore.setState({ isLoading: false });
    }
  };

  const { isListening, error, toggleListening, setError } = useSpeechToText(processIntent);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processIntent(transcript);
  };

  return (
    <div className="w-full px-4 mb-8">
      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form 
        onSubmit={handleManualSubmit}
        className={`relative flex items-center w-full bg-white border shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-full overflow-hidden transition-all duration-200 ${
          isListening ? "border-[#FF9900] ring-2 ring-[#FF9900]/20" : "border-neutral-200 focus-within:border-[#FF9900] focus-within:ring-1 focus-within:ring-[#FF9900]"
        }`}
      >
        <div className="pl-4 text-neutral-400">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={transcript}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Search Amazon Now..."
          disabled={isLoading}
          className="flex-1 w-full py-3.5 px-3 text-sm text-neutral-900 bg-transparent outline-none placeholder:text-neutral-400"
        />

        <div className="flex items-center pr-2 gap-1 text-neutral-400">
          <button type="button" className="p-2 hover:text-neutral-900 transition-colors">
            <Scan className="w-[22px] h-[22px]" />
          </button>
          {transcript.length > 0 && !isListening && (
            <button 
              type="submit"
              disabled={isLoading}
              className="p-2 text-neutral-900 hover:text-[#FF9900] transition-colors"
            >
              {isLoading ? <Loader2 className="w-[22px] h-[22px] animate-spin" /> : <SendHorizontal className="w-[22px] h-[22px]" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (error) setError(null);
              toggleListening();
            }}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
              isListening ? "text-white bg-[#FF9900] animate-pulse" : "hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {isLoading && !isListening ? <Loader2 className="w-[22px] h-[22px] animate-spin text-neutral-400" /> : (
              isListening ? <MicOff className="w-[22px] h-[22px]" /> : <Mic className="w-[22px] h-[22px]" />
            )}
          </button>
        </div>
      </form>

      {isListening && (
        <p className="text-[10px] font-bold text-[#FF9900] uppercase tracking-widest text-center mt-3 animate-pulse">
          Listening...
        </p>
      )}
    </div>
  );
}