// components/terminal/BootSequence.tsx
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "█ PORTFOLIO OS v1.0.0 — booting...",
  "  > loading modules ........ [OK]",
  "  > mounting /home/you/ ....... [OK]",
  "  > starting shell ............... [OK]",
  "",
  "┌─────────────────────────────────────────┐",
  "│  Hi. I'm [Your Name].                   │",
  "│  Student. Builder. Tinkerer.            │",
  "│  Type 'help' to see what I've made.     │",
  "└─────────────────────────────────────────┘",
];

interface Props { onComplete: () => void; }

export function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const LINE_DELAY = 0.04;

  const [done, setDone] = useState(false);
  const completedRef = useRef(false);

  const prefersReduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (prefersReduced) { handleComplete(); return; }
    let i = 0;
    const interval = setInterval(() => {
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => { setDone(true); setTimeout(handleComplete, 400); }, 300);
        return;
      }
      setVisibleLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
    }, 220);
    return () => clearInterval(interval);
  }, [handleComplete, prefersReduced]);

  // Skip on any keypress
  useEffect(() => {
    if (prefersReduced) return;
    const skip = () => { setDone(true); handleComplete(); };
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, [handleComplete, prefersReduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="font-mono text-sm text-text-soft p-6 space-y-0.5"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
         >
          {visibleLines.map((line, idx) => (
            <motion.div
              key={line || "\u00A0"}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * LINE_DELAY, duration: 0.15 }}
              className={line?.startsWith("│") || line?.startsWith("┌") || line?.startsWith("└")
                ? "text-primary glow-primary"
                : line?.includes("[OK]")
                  ? "text-primary"
                  : "text-text-soft"}
            >
              {line || "\u00A0"}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
