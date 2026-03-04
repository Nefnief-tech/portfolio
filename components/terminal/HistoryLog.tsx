"use client";
import { motion } from "framer-motion";
import type { HistoryEntry } from "@/lib/terminal/types";

interface Props {
  entries: HistoryEntry[];
}

export function HistoryLog({ entries }: Props) {
  return (
    <div className="font-mono text-sm px-6 space-y-1 overflow-y-auto">
      {entries.map((entry, idx) => {
        const key = `${entry.kind}-${idx}-${entry.kind === "section" ? entry.section : entry.text}`;
        if (entry.kind === "input") {
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="term-green"
            >
              {entry.text}
            </motion.div>
          );
        }
        if (entry.kind === "output") {
          const colorCls = entry.isError
            ? "text-red-500"
            : (entry.colorClass ?? "text-text-soft");
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`whitespace-pre-wrap ${colorCls}`}
            >
              {entry.text}
            </motion.div>
          );
        }
        // section entries render nothing here — handled by OutputRenderer
        return null;
      })}
    </div>
  );
}
