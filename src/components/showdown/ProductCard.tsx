// src/components/showdown/ProductCard.tsx
"use client";

import React from "react";
import { RankedItem } from "@/types/inventory";
import TrustBadge from "./TrustBadge";
import AlternativeFlag from "./AlternativeFlag";
import { Clock, Tag, TrendingUp, CheckCircle2, Plus, Minus } from "lucide-react";

interface ProductCardProps {
  item: RankedItem;
  rank: number;
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
}

export default function ProductCard({ item, rank, quantity, onUpdateQuantity }: ProductCardProps) {
  const isSelected = quantity > 0;

  return (
    <div 
      className={`relative w-full bg-white border rounded-2xl p-4 transition-all duration-200 ${
        item.is_alternative 
          ? "border-amber-400 ring-1 ring-amber-400/30 hover:border-amber-500" 
          : "border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Checkbox Icon in Corner if selected */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full">
          <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
        </div>
      )}

      {item.is_alternative && item.alternative_message && (
        <AlternativeFlag message={item.alternative_message} />
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Product Image Placeholder/Thumbnail */}
        <div className="w-16 h-16 shrink-0 bg-neutral-100 rounded-xl border border-neutral-200 overflow-hidden relative flex items-center justify-center">
          <span className="text-xl font-black text-neutral-300 select-none">
            {item.brand.charAt(0)}
          </span>
          <img 
            src={item.image_url} 
            alt={item.product_name}
            onError={(e) => (e.currentTarget.style.display = 'none')}
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black bg-neutral-900 text-white w-4 h-4 rounded-md flex items-center justify-center">
              {rank}
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {item.brand}
            </span>
          </div>
          <h3 className="font-bold text-sm text-neutral-900 tracking-tight leading-snug mb-2">
            {item.product_name}
          </h3>
        </div>

        {/* Algorithmic Score Output Badge */}
        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono font-bold bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500">
            Score: {Math.round(item.score)}
          </span>
        </div>
      </div>

      {/* Core Operational Fulfillment Metrics */}
      <div className="grid grid-cols-2 gap-2 border-t border-b border-neutral-50 py-2.5 my-3">
        <div className="flex items-center gap-1.5 text-neutral-600">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs font-extrabold tracking-tight">{item.eta_mins} mins</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-900">
          {item.surge_multiplier > 1 ? (
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span className="text-xs font-extrabold tracking-tight">
            ₹{Math.round(item.base_price * item.surge_multiplier)}
          </span>
          {item.surge_multiplier > 1 && (
            <span className="text-[10px] text-neutral-400 line-through ml-1">
              ₹{item.base_price}
            </span>
          )}
        </div>
      </div>

      {/* Social Proof Indicator */}
      <div className="mb-3 px-2 py-1.5 bg-[#FF9900]/10 rounded-lg flex items-center gap-1.5 border border-[#FF9900]/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9900] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9900]"></span>
        </span>
        <span className="text-[10px] font-bold text-neutral-800 tracking-tight">
          High Demand: {(item.purchase_frequency_rank % 30) + 12} people in your area bought this in the last hour.
        </span>
      </div>

      <div className="flex items-center justify-between pt-1">
        {/* Structured AI Sentiment Synthesis Layout */}
        <div className="flex flex-wrap gap-1.5">
          <TrustBadge text={item.llm_review_pros} type="pro" />
          <TrustBadge text={item.llm_review_cons} type="con" />
        </div>

        {/* Quantity Selectors */}
        <div className="flex items-center gap-3 bg-neutral-100 rounded-full px-2 py-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdateQuantity(-1); }}
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-bold text-sm w-4 text-center">{quantity}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdateQuantity(1); }}
            className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}