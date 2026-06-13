// src/app/admin/page.tsx
"use client";

import React, { useState } from "react";
import { CloudRain, Terminal, CheckCircle } from "lucide-react";
import { useSystemStore } from "@/store/useSystemStore";

export default function AdminControlCenter() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const triggerSystemEvent = async (type: string) => {
    setStatus(`Simulating ${type}...`);
    try {
      const response = await fetch("/api/system/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: type }),
      });
      
      if (response.ok) {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [
          `[${timestamp}] SUCCESS: Dispatched warehouse replenishment payloads.`,
          ...prev,
        ]);
        setStatus("Event fired.");
        
        // Use global Zustand store instead of sessionStorage
        if (type === "WEATHER_ALERT") {
          useSystemStore.getState().triggerNudge("RAIN_CRISIS");
        }
      }
    } catch (err) {
      console.error(err);
      setStatus("Simulation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-mono">
      <div className="max-w-xl mx-auto border border-neutral-800 rounded-2xl bg-neutral-900 p-6 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-4 mb-6">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h1 className="text-md font-bold uppercase tracking-wider text-neutral-300">
            IntentOS // Judge Control Panel
          </h1>
        </div>

        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          Execute external infrastructure vectors to demonstrate real-time data consumption 
          and dark store automated inventory loops live on stage.
        </p>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => triggerSystemEvent("WEATHER_ALERT")}
            className="w-full flex items-center justify-between p-4 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-300 rounded-xl transition-all duration-150 group"
          >
            <div className="flex items-center gap-3">
              <CloudRain className="w-5 h-5 animate-bounce" />
              <span className="font-bold text-sm text-left">Trigger Hyperlocal Weather Vector</span>
            </div>
            <span className="text-xs opacity-60 group-hover:opacity-100">RUN CLOUD LOOP →</span>
          </button>
        </div>

        {status && (
          <div className="text-xs text-amber-400 mb-4 bg-amber-950 bg-opacity-40 border border-amber-900/50 p-2 rounded-lg">
            ⚡ {status}
          </div>
        )}

        <div className="border border-neutral-800 rounded-xl bg-neutral-950 p-4">
          <h3 className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wide">
            Console Sync Out
          </h3>
          <div className="space-y-1 max-h-40 overflow-y-auto text-[11px] text-neutral-400">
            {logs.length === 0 && <span className="text-neutral-600">Awaiting runtime execution trigger payloads...</span>}
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}