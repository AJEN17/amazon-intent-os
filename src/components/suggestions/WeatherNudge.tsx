// src/components/suggestions/WeatherNudge.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Sun, ThermometerSnowflake, Droplets, Umbrella } from "lucide-react";
import { useCrisisStore, CrisisCategory } from "@/store/useCrisisStore";

interface WeatherData {
  temp: number;
  mainCondition: string;
  description: string;
  iconUrl: string;
}

interface Suggestion {
  label: string;
  icon: React.ElementType;
  crisisId: CrisisCategory;
  categoryTag: string;
}

export default function WeatherNudge() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch("/api/weather");
        const data = await res.json();
        if (data.success && data.weather) {
          setWeather(data.weather);
          setIsVisible(true);
        }
      } catch (e) {
        console.error("Weather fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    
    // Slight delay to ensure it doesn't pop instantly on jarring load
    setTimeout(loadWeather, 1000);
  }, []);

  if (!isVisible || !weather || loading) return null;

  // Determine suggestions based on weather
  let suggestions: Suggestion[] = [];
  let headerTitle = "Nice weather today!";
  let bgGradient = "from-blue-50 to-white";

  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 5 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 17;
  const isEvening = currentHour >= 17 && currentHour < 21;
  // const isNight = currentHour >= 21 || currentHour < 5;

  if (weather.mainCondition === "Rain" || weather.mainCondition === "Drizzle" || weather.mainCondition === "Thunderstorm") {
    headerTitle = "Looks like rain! 🌧️";
    bgGradient = "from-slate-200 to-white";
    suggestions = [
      { label: "Umbrellas", icon: Umbrella, crisisId: "RAIN_CRISIS", categoryTag: "umbrella" },
      { label: "Hot Tea", icon: ThermometerSnowflake, crisisId: "COOKING_CRISIS", categoryTag: "tea" }
    ];
  } else if (weather.temp > 38) {
    headerTitle = "It's scorching hot! ☀️";
    bgGradient = "from-orange-100 to-white";
    suggestions = [
      { label: "Cold Drinks", icon: Droplets, crisisId: "PARTY_CRISIS", categoryTag: "cola" },
      { label: "Ice Cream", icon: Sun, crisisId: "PARTY_CRISIS", categoryTag: "ice_cream" }
    ];
  } else if (weather.temp >= 32) {
    if (isMorning) {
      headerTitle = "Warm morning today! 🌅";
      bgGradient = "from-amber-50 to-white";
    } else if (isAfternoon) {
      headerTitle = "Hot afternoon, stay hydrated! 🥤";
      bgGradient = "from-orange-50 to-white";
    } else if (isEvening) {
      headerTitle = "Warm evening tonight! 🌙";
      bgGradient = "from-indigo-50 to-white";
    } else {
      headerTitle = "Warm night! 🌙";
      bgGradient = "from-indigo-100 to-white";
    }
    suggestions = [
      { label: "Cold Drinks", icon: Droplets, crisisId: "PARTY_CRISIS", categoryTag: "cola" },
      { label: "Snacks", icon: Sun, crisisId: "PARTY_CRISIS", categoryTag: "potato" }
    ];
  } else if (weather.temp < 20) {
    if (isMorning) {
      headerTitle = "Chilly morning! ❄️";
    } else {
      headerTitle = "It's a bit cold! ❄️";
    }
    bgGradient = "from-cyan-100 to-white";
    suggestions = [
      { label: "Hot Coffee", icon: ThermometerSnowflake, crisisId: "COOKING_CRISIS", categoryTag: "coffee" },
      { label: "Room Heater", icon: Sun, crisisId: "POWER_CUT_CRISIS", categoryTag: "heater" }
    ];
  } else {
    // 20-31 degrees is pleasant/normal for Mumbai
    if (isMorning) {
      headerTitle = "Beautiful morning! ☀️";
    } else if (isEvening) {
      headerTitle = "Pleasant evening! 🌅";
    } else {
      headerTitle = "Perfect weather today! 🌤️";
    }
    bgGradient = "from-emerald-50 to-white";
    suggestions = [
      { label: "Snacks", icon: Droplets, crisisId: "PARTY_CRISIS", categoryTag: "potato" },
      { label: "Cold Drinks", icon: Sun, crisisId: "PARTY_CRISIS", categoryTag: "cola" }
    ];
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-40 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`bg-gradient-to-b ${bgGradient} border border-neutral-200 rounded-2xl shadow-xl overflow-hidden`}>
        
        {/* Header Section */}
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={weather.iconUrl} alt="Weather icon" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 leading-tight">
                {headerTitle}
              </h3>
              <p className="text-xs text-neutral-500 capitalize">
                Mumbai • {weather.temp}°C • {weather.description}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1.5 bg-white/50 hover:bg-white rounded-full transition-colors text-neutral-400 hover:text-neutral-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestions Section */}
        <div className="px-4 pb-4">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-1">
            Amazon Now Suggests:
          </p>
          <div className="flex gap-2">
            {suggestions.map((sug, idx) => {
              const Icon = sug.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setIsVisible(false);
                    triggerCrisis(sug.crisisId, sug.categoryTag, false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-neutral-200 py-2 px-3 rounded-xl hover:border-[#FF9900] hover:text-[#FF9900] transition-colors shadow-sm active:scale-95"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{sug.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
