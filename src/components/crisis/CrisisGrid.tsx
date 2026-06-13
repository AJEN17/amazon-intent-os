// src/components/crisis/CrisisGrid.tsx
"use client";

import React from "react";
import { useCrisisStore } from "@/store/useCrisisStore";
import { CrisisCategory } from "@/types/intent";
import { 
  Wine, 
  Baby, 
  Plane, 
  Pill, 
  CloudRain, 
  Zap, 
  ChefHat, 
  Dog 
} from "lucide-react";

interface CrisisTile {
  id: CrisisCategory;
  label: string;
  categoryTag: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const CRISIS_TILES: CrisisTile[] = [
  { id: "PARTY_CRISIS", label: "Party Crisis", categoryTag: "soft_drinks", icon: Wine, color: "bg-orange-50 text-orange-600 border-orange-200" },
  { id: "BABY_CRISIS", label: "Baby Crisis", categoryTag: "baby_formula", icon: Baby, color: "bg-blue-50 text-blue-600 border-blue-200" },
  { id: "TRAVEL_CRISIS", label: "Travel Crisis", categoryTag: "travel_essentials", icon: Plane, color: "bg-purple-50 text-purple-600 border-purple-200" },
  { id: "MEDICINE_CRISIS", label: "Medicine Crisis", categoryTag: "pharmacy", icon: Pill, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  { id: "RAIN_CRISIS", label: "Rain Crisis", categoryTag: "rain_gear", icon: CloudRain, color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  { id: "POWER_CUT_CRISIS", label: "Power Cut", categoryTag: "power_bank", icon: Zap, color: "bg-amber-50 text-amber-600 border-amber-200" },
  { id: "COOKING_CRISIS", label: "Cooking Fix", categoryTag: "groceries", icon: ChefHat, color: "bg-rose-50 text-rose-600 border-rose-200" },
  { id: "PET_CRISIS", label: "Pet Emergency", categoryTag: "pet_supplies", icon: Dog, color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
];

export default function CrisisGrid() {
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);
  const isLoading = useCrisisStore((state) => state.isLoading);

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h2 className="text-sm font-bold text-neutral-900 tracking-tight mb-3">
        Amazon Now Urgent Bundles
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {CRISIS_TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              disabled={isLoading}
              onClick={() => triggerCrisis(tile.id, tile.categoryTag, false)}
              className={`flex flex-col items-start justify-between p-4 h-28 rounded-2xl border transition-all duration-200 active:scale-98 ${tile.color} disabled:opacity-50 disabled:pointer-events-none`}
            >
              <div className="p-2 rounded-xl bg-white bg-opacity-80 shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm tracking-tight">{tile.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}