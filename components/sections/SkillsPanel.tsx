"use client";
import { motion } from "framer-motion";
import { SKILLS } from "@/lib/content/skills";

export function SkillsPanel() {
  type Line = { text: string; color: string; delay: number };
  const lines: Line[] = [];
  let delay = 0;

  const push = (text: string, color: string) => {
    lines.push({ text, color, delay });
    delay += 0.025;
  };

  push(`> cat skills.json`, "text-muted");
  push(``, "text-text-soft");
  push(`{`, "text-text-soft");
  Object.entries(SKILLS).forEach(([key, vals], i, arr) => {
    const comma = i < arr.length - 1 ? "," : "";
    push(`  "${key}": [`, "text-accent");
    vals.forEach((v, vi) => {
      const isLast = vi === vals.length - 1;
      push(`    "${v}"${isLast ? "" : ","}`, "text-text-soft");
    });
    push(`  ]${comma}`, "text-muted");
  });
  push(`}`, "text-text-soft");

  return (
    <div className="px-6 py-3 font-mono text-sm space-y-0.5">
      {lines.map((l, i) => (
        <motion.div
          key={`${l.text}-${i}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: l.delay, duration: 0.12 }}
          className={l.color}
        >
          {l.text || "\u00A0"}
        </motion.div>
      ))}
    </div>
  );
}
