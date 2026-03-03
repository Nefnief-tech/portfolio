// components/ParticleBackground.tsx
"use client";

export function ParticleBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-950 to-purple-950"
      style={{
        background: 'linear-gradient(to bottom, #080010 0%, #2a1a40 100%)'
      }}
    />
  );
}
