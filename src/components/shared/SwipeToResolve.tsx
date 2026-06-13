// src/components/shared/SwipeToResolve.tsx
"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface SwipeToResolveProps {
  onSuccess: () => void;
}

export default function SwipeToResolve({ onSuccess }: SwipeToResolveProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const x = useMotionValue(0);
  
  const bgOpacity = useTransform(x, [0, 260], [0.1, 1]);
  const textOpacity = useTransform(x, [0, 150], [1, 0]);

  const handleDragEnd = () => {
    if (x.get() > 250) {
      x.set(290);
      setIsCompleted(true);
      setTimeout(() => {
        onSuccess();
      }, 600);
    } else {
      x.set(0);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-14 bg-neutral-100 rounded-2xl relative overflow-hidden p-1 border border-neutral-200 select-none">
      <motion.div 
        className="absolute inset-0 bg-emerald-600 rounded-2xl pointer-events-none"
        style={{ opacity: bgOpacity }}
      />

      <AnimatePresence>
        {!isCompleted ? (
          <div className="w-full h-full flex items-center justify-center relative">
            <motion.span 
              style={{ opacity: textOpacity }}
              className="text-xs font-black text-neutral-500 uppercase tracking-widest pl-10"
            >
              Swipe to Resolve
            </motion.span>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 290 }}
              dragElastic={0.1}
              dragMomentum={false}
              style={{ x }}
              onDragEnd={handleDragEnd}
              className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white cursor-grab active:cursor-grabbing absolute left-1 shadow-sm border border-neutral-800"
            >
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </motion.div>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full flex items-center justify-center gap-2 text-white font-bold text-sm z-10 relative"
          >
            <CheckCircle2 className="w-4 h-4 animate-bounce" />
            Order Locked & Dispatched
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}