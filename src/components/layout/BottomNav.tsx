// src/components/layout/BottomNav.tsx
"use client";

import React from 'react';
import { Home, PlaySquare, User, ShoppingCart, Menu } from 'lucide-react';

export default function BottomNav() {
  const activeClass = "flex flex-col items-center justify-center w-full h-full text-[#007185] relative";
  const inactiveClass = "flex flex-col items-center justify-center w-full h-full text-neutral-600 hover:text-neutral-900 transition-colors";

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-neutral-200 flex justify-around items-center h-14 z-30 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <button className={activeClass}>
        <div className="absolute top-0 w-8 h-[3px] bg-[#007185] rounded-b-md"></div>
        <Home className="w-[22px] h-[22px] mt-1" />
      </button>
      <button className={inactiveClass}>
        <PlaySquare className="w-[22px] h-[22px]" />
      </button>
      <button className={inactiveClass}>
        <User className="w-[22px] h-[22px]" />
      </button>
      <button className={inactiveClass}>
        <ShoppingCart className="w-[22px] h-[22px]" />
      </button>
      <button className={inactiveClass}>
        <Menu className="w-[22px] h-[22px]" />
      </button>
    </div>
  );
}
