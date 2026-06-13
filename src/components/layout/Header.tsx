// src/components/layout/Header.tsx
"use client";

import React from 'react';
import { MapPin, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full px-4 pt-4 pb-2 bg-white sticky top-0 z-30 shadow-sm border-b border-neutral-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Amazon-style Logo */}
          <div className="flex flex-col items-center justify-center pt-1">
            <span className="font-black text-xl tracking-tighter text-neutral-900 leading-none">
              amazon
            </span>
            <svg viewBox="0 0 100 30" className="w-12 h-3 -mt-1 text-[#FF9900] fill-current">
              <path d="M10,5 C30,25 70,25 90,5 L85,15 C65,30 35,30 15,15 Z" />
            </svg>
          </div>
          <div className="ml-2">
            <h1 className="font-black text-sm tracking-tight text-neutral-900 leading-none">
              <span className="text-[#FF9900]">Now</span>
            </h1>
            <div className="flex items-center gap-1 mt-0.5 text-neutral-500">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-bold tracking-tight">Thane, 400601</span>
            </div>
          </div>
        </div>
        <button className="p-2 relative bg-neutral-50 rounded-full border border-neutral-100 hover:bg-neutral-100 transition-colors">
          <Bell className="w-4 h-4 text-neutral-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
