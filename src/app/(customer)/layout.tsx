// src/app/(customer)/layout.tsx
import React from "react";

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col antialiased">
      <main className="flex-1 w-full max-w-md mx-auto bg-white min-h-screen shadow-xl border-x border-neutral-100 pb-24 relative overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}