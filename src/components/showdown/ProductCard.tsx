// src/components/showdown/ProductCard.tsx
"use client";

import React from "react";
import { RankedItem } from "@/types/inventory";
import TrustBadge from "./TrustBadge";
import AlternativeFlag from "./AlternativeFlag";
import { Clock, Tag } from "lucide-react";

interface ProductCardProps {
  item: RankedItem;
  rank: number;
}

export default function ProductCard({ item, rank }: ProductCardProps) {
  return (
    <div className={`w-full bg-white border rounded-2xl p-4 transition-all duration-200 ${
      item.is_alternative 
        ? "border-amber-400 ring-1 ring-amber-400/30" 
        : "border-neutral-100 hover:border-neutral-200"
    }`}>
      {item.is_alternative && item.alternative_message && (
        <AlternativeFlag message={item.alternative_message} />
      )}

      <div className="flex items-start justify-between gap-3">
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
          <Tag className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs font-extrabold tracking-tight">₹{item.base_price}</span>
        </div>
      </div>

      {/* Structured AI Sentiment Synthesis Layout */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <TrustBadge text={item.llm_review_pros} type="pro" />
        <TrustBadge text={item.llm_review_cons} type="con" />
      </div>
    </div>
  );
}