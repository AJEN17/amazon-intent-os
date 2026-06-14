// src/components/suggestions/YourUsuals.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchUserHistory, fetchFullInventory } from "@/lib/db/mockClient";
import { predictUsuals, PredictedItem, PurchaseRecord } from "@/lib/scoring/predictionEngine";
import { useCrisisStore, CrisisCategory } from "@/store/useCrisisStore";
import { Clock, TrendingUp } from "lucide-react";

export default function YourUsuals() {
  const [suggestions, setSuggestions] = useState<PredictedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);

  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true);
      try {
        const history = await fetchUserHistory() as PurchaseRecord[];
        const inventory = await fetchFullInventory();
        const currentHour = new Date().getUTCHours();

        const predicted = predictUsuals(history, inventory, currentHour);
        setSuggestions(predicted);
      } catch (error) {
        console.error("Failed to load suggestions", error);
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 flex justify-center">
        <div className="w-6 h-6 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
          Your Usuals
        </h2>
        <span className="text-[10px] font-bold bg-[#FF9900]/10 text-[#FF9900] px-2 py-1 rounded-full border border-[#FF9900]/20">
          Predicted for You
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((item) => (
          <button
            key={item.asin}
            onClick={() => {
              // Passing true for isSearch so it behaves like a direct request
              triggerCrisis(item.macro_crisis as CrisisCategory, item.category, true);
            }}
            className="text-left flex flex-col p-3 rounded-2xl border border-neutral-200 bg-white hover:border-[#FF9900] hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className="w-full h-24 bg-neutral-100 rounded-xl mb-3 overflow-hidden relative flex items-center justify-center">
              <span className="text-2xl font-black text-neutral-300 select-none">
                {item.brand.charAt(0)}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.product_name}
                onError={(e) => (e.currentTarget.style.display = 'none')}
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
              />
            </div>

            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1 line-clamp-1">
              {item.brand}
            </span>
            <h3 className="font-bold text-xs text-neutral-900 leading-snug mb-2 line-clamp-2 min-h-[32px]">
              {item.product_name}
            </h3>

            <div className="mt-auto w-full flex items-center justify-between pt-2 border-t border-neutral-50">
              <span className="text-xs font-extrabold tracking-tight">
                ₹{Math.round(item.base_price * item.surge_multiplier)}
              </span>
              <div className="flex items-center gap-1 text-neutral-400">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold">{item.eta_mins}m</span>
              </div>
            </div>

            {item.timeMatchBoost && (
              <div className="mt-2 w-full flex items-center gap-1 text-[#FF9900] bg-[#FF9900]/10 px-1.5 py-0.5 rounded text-[9px] font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>Usual time!</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
