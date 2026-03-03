// components/ParticleBackground.tsx
"use client";
import { useCallback } from "react";
import Particles from "@tsparticles/react@3.0.0";
import { loadSlim } from "@tsparticles/slim@3.7.1";
import type { Engine } from "@tsparticles/engine";

export function ParticleBackground() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={init}
      className="fixed inset-0 -z-10"
      options={{
        background: { color: { value: "#080010" } },
        fpsLimit: 60,
        particles: {
          number:   { value: 60, density: { enable: true, area: 800 } },
          color:    { value: ["#9B30FF", "#E040FB", "#5B4A73"] },
          opacity:  { value: { min: 0.05, max: 0.25 } },
          size:     { value: { min: 1, max: 2 } },
          move:     { enable: true, speed: 0.4, direction: "none", random: true, outModes: "out" },
          links:    { enable: true, color: "#2A1A40", distance: 120, opacity: 0.15, width: 1 },
        },
        detectRetina: true,
      }}
    />
  );
}
