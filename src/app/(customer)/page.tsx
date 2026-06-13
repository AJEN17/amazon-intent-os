// src/app/(customer)/page.tsx
import React from "react";
import CrisisGrid from "@/components/crisis/CrisisGrid";
import VoiceTranscriber from "@/components/crisis/VoiceTranscriber";
import ShowdownDrawer from "@/components/showdown/ShowdownDrawer";
import NudgeModal from "@/components/shared/NudgeModal";
import { ShoppingBag, MapPin } from "lucide-react";

export default function ConsumerDashboardPortal() {
  return (
    <div className="pt-6">
      {/* High-Contrast Minimalist App Bar Header */}
      <div className="w-full px-4 flex items-center justify-between border-b border-neutral-50 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm">
            α
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-neutral-900 leading-none">
              Amazon IntentOS
            </h1>
            <span className="text-[10px] text-neutral-400 font-mono">MVP // ENGINE</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/40">
          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-bold tracking-tight">Thane, 400601</span>
        </div>
      </div>

      {/* Hero Explainer Core Segment */}
      <div className="px-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl text-white shadow-sm">
          <h2 className="font-extrabold text-sm tracking-tight mb-1">
            Outcome-Based Quick Commerce
          </h2>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            State your micro-crisis scenario via voice or interface triggers. We bypass the 
            search grid to calculate optimal local warehouse configurations within seconds.
          </p>
        </div>
      </div>

      {/* Component Interaction Layer Groups */}
      <CrisisGrid />
      <VoiceTranscriber />

      {/* Hidden Sheet & Intercept Overlay Layers */}
      <ShowdownDrawer />
      <NudgeModal />
    </div>
  );
}