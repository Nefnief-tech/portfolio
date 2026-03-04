"use client";
import { useState } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { BootSequence } from "@/components/terminal/BootSequence";
import { FloatingNav } from "@/components/terminal/FloatingNav";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import type { Section } from "@/lib/terminal/types";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[90vh] rounded-xl border border-border bg-surface/90 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
          {booted ? (
            <BootSequence onComplete={() => setBooted(true)} />
          ) : (
            <TerminalWindow onNavigate={setActiveSection} />
          )}
        </div>
      </div>

      {booted && (
        <FloatingNav active={activeSection} onSelect={setActiveSection} />
      )}
    </main>
  );
}
