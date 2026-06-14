// src/app/(customer)/page.tsx
"use client";

import React from "react";
import CrisisGrid from "@/components/crisis/CrisisGrid";
import VoiceTranscriber from "@/components/crisis/VoiceTranscriber";
import ShowdownDrawer from "@/components/showdown/ShowdownDrawer";
import NudgeModal from "@/components/shared/NudgeModal";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import YourUsuals from "@/components/suggestions/YourUsuals";
import WeatherNudge from "@/components/suggestions/WeatherNudge";
import { useSystemStore } from "@/store/useSystemStore";

export default function ConsumerDashboardPortal() {
  const isSearchFocused = useSystemStore((state) => state.isSearchFocused);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header />
      <div className="pt-4 flex-1">
        {/* The Omni-Search Bar goes FIRST */}
        <VoiceTranscriber />

        {/* Scrollable Category Tags */}
        <div className="w-full overflow-x-auto no-scrollbar pl-4 pr-4 mb-6 -mt-3 flex items-center gap-2">
          {["Groceries", "Medical Care", "Urgent Needs", "Same-Day", "Deals", "Fresh"].map((tag) => (
            <button key={tag} className="flex-shrink-0 px-3 py-1.5 bg-neutral-100 text-neutral-800 text-[11px] font-bold rounded-full border border-neutral-200 hover:bg-neutral-200 transition-colors">
              {tag}
            </button>
          ))}
        </div>

        {/* Component Interaction Layer Groups */}
        {isSearchFocused ? <YourUsuals /> : <CrisisGrid />}
      </div>

      {/* Hidden Sheet & Intercept Overlay Layers */}
      <WeatherNudge />
      <ShowdownDrawer />
      <NudgeModal />
      <BottomNav />
    </div>
  );
}