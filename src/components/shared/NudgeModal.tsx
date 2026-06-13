// src/components/shared/NudgeModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCrisisStore } from "@/store/useCrisisStore";
import { CloudLightning, X } from "lucide-react";

export default function NudgeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);

  useEffect(() => {
    // Check local storage records periodically to mock ambient contextual triggers
    const checkInterval = setInterval(() => {
      const activeNudge = window.sessionStorage.getItem("active_nudge");
      if (activeNudge === "RAIN_CRISIS") {
        setIsOpen(true);
        window.sessionStorage.removeItem("active_nudge"); // Clear to prevent loops
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const handleIntercept = () => {
    setIsOpen(false);
    // Directly deploy the Rain Gear target payload array context automatically
    triggerCrisis("RAIN_CRISIS", "rain_gear");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/4 left-4 right-4 max-w-sm mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl z-50 text-white"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="p-3 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-2xl">
                <CloudLightning className="w-5 h-5 animate-pulse" />
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-full bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-black text-base text-neutral-100 tracking-tight mb-1">
              Hyperlocal Weather Alert
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Severe storms approaching Thane in 15 minutes. Amazon Now Hubs have staged 
              Rain Essentials Kits to bypass courier backlogs. Lock delivery path now.
            </p>

            <button
              onClick={handleIntercept}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all duration-150"
            >
              Intercept Rain Bundle
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}