"use client";
import { useState } from "react";
import { BootSequence }      from "@/components/terminal/BootSequence";
import { TerminalWindow }    from "@/components/terminal/TerminalWindow";
import { FloatingNav }       from "@/components/terminal/FloatingNav";
import { ParticleBackground } from "@/components/ParticleBackground";
import type { Section }       from "@/lib/terminal/types";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[90vh] rounded-xl border border-border bg-surface/90 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
          {booted ? (
            <BootSequence onComplete={() => setBooted(true)} />
          ) : (
            <TerminalWindow onNavigate={setActiveSection} onBooted={booted} />
          )}
        </div>
      </div>
      {booted && (
        <FloatingNav
          active={activeSection}
          onSelect={setActiveSection}
        />
      )}
    </main>
  );
}
