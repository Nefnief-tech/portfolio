// components/terminal/BootSequence.tsx
"use client";
import { useEffect, useState } from "react";
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
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => { setDone(true); setTimeout(onComplete, 400); }, 300);
        return;
      }
      setVisibleLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
    }, 220);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Skip on any keypress
  useEffect(() => {
    const skip = () => { setDone(true); onComplete(); };
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="font-mono text-sm text-text-soft p-6 space-y-0.5"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {visibleLines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={line.startsWith("│") || line.startsWith("┌") || line.startsWith("└")
                ? "text-primary glow-primary"
                : line.includes("[OK]")
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
