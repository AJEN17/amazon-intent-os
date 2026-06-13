// src/components/showdown/TrustBadge.tsx
"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface TrustBadgeProps {
  text: string;
  type: "pro" | "con";
}

export default function TrustBadge({ text, type }: TrustBadgeProps) {
  const isPro = type === "pro";
  
  return (
    <div 
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight border ${
        isPro 
          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
          : "bg-neutral-50 text-neutral-600 border-neutral-200"
      }`}
    >
      {isPro ? (
        <Plus className="w-3 h-3 stroke-[3]" />
      ) : (
        <Minus className="w-3 h-3 stroke-[3]" />
      )}
      <span>{text}</span>
    </div>
  );
}