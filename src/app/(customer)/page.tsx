// src/app/(customer)/page.tsx
import React from "react";
import CrisisGrid from "@/components/crisis/CrisisGrid";
import VoiceTranscriber from "@/components/crisis/VoiceTranscriber";
import ShowdownDrawer from "@/components/showdown/ShowdownDrawer";
import NudgeModal from "@/components/shared/NudgeModal";
import { MapPin } from "lucide-react";

export default function ConsumerDashboardPortal() {
  return (
    <div className="pt-4">
      {/* High-Contrast Minimalist App Bar Header */}
      <div className="w-full px-4 flex items-center justify-between pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm">
            α
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-neutral-900 leading-none">
              Amazon IntentOS
            </h1>
            <span className="text-[10px] text-neutral-400 font-mono">THANE HUB // LIVE</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/40">
          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[11px] font-bold tracking-tight">Thane, 400601</span>
        </div>
      </div>

      {/* The Omni-Search Bar goes FIRST */}
      <VoiceTranscriber />

      {/* Component Interaction Layer Groups */}
      <CrisisGrid />

      {/* Hidden Sheet & Intercept Overlay Layers */}
      <ShowdownDrawer />
      <NudgeModal />
    </div>
  );
}