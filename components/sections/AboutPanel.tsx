"use client";
import { motion } from "framer-motion";
import { ABOUT } from "@/lib/content/about";

const LINE_DELAY = 0.04;

export function AboutPanel() {
  const lines = [
    `> cat about.md`,
    ``,
    `## ${ABOUT.name}`,
    ABOUT.tagline,
    ABOUT.location,
    ``,
    ...ABOUT.bio,
    ``,
    ...ABOUT.links.map(l => `  [${l.label}] ${l.href}`),
  ];

  return (
    <div className="px-6 py-3 font-mono text-sm space-y-0.5">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * LINE_DELAY, duration: 0.15 }}
          className={
            line.startsWith("##")
              ? "text-accent font-bold text-base glow-accent"
              : line.startsWith(">")
                ? "text-muted"
                : line.startsWith("  [")
                  ? "text-primary underline glow-primary cursor-pointer hover:text-accent"
                  : "text-text-soft"
          }
        >
          {line || "\u00A0"}
        </motion.div>
      ))}
    </div>
  );
}