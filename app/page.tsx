"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GUIView } from "@/components/GUIView";
import { ParticleBackground } from "@/components/ParticleBackground";
import { BootSequence } from "@/components/terminal/BootSequence";
import { FloatingNav } from "@/components/terminal/FloatingNav";
import { TerminalWindow } from "@/components/terminal/TerminalWindow";
import { TerminalProvider } from "@/lib/terminal/TerminalContext";
import type { Section } from "@/lib/terminal/types";
import { useTerminal } from "@/lib/terminal/useTerminal";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState<"terminal" | "gui">("terminal");
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  const terminal = useTerminal();

  useEffect(() => {
    if (terminal.state.guiRequested) {
      terminal.clearGuiRequest();
      setMode("gui");
    }
  }, [terminal.state.guiRequested, terminal.clearGuiRequest]);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <TerminalProvider value={terminal}>
          <div
            className={`relative w-full max-w-4xl h-full max-h-[90vh] rounded-xl border border-border bg-surface/90 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10 ${
              !booted ? "terminal-kinetic" : ""
            }`}
          >
            <AnimatePresence mode="wait">
              {!booted ? (
                <motion.div
                  key="boot"
                  className="h-full"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <BootSequence onComplete={() => setBooted(true)} />
                </motion.div>
              ) : mode === "gui" ? (
                <motion.div
                  key="gui"
                  className="h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <GUIView onSwitchToTerminal={() => setMode("terminal")} />
                </motion.div>
              ) : (
                <motion.div
                  key="terminal"
                  className="h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <TerminalWindow onNavigate={setActiveSection} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TerminalProvider>
      </div>

      {booted && mode === "terminal" && (
        <FloatingNav active={activeSection} onSelect={setActiveSection} />
      )}
    </main>
  );
}
