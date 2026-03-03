"use client";
import { motion } from "framer-motion";
import type { HistoryEntry } from "@/lib/terminal/types";

interface Props { entries: HistoryEntry[]; }

export function HistoryLog({ entries }: Props) {
  return (
    <div className="font-mono text-sm px-6 space-y-1 overflow-y-auto">
      {entries.map((entry, idx) => {
        if (entry.kind === "input") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted"
            >
              {entry.text}
            </motion.div>
          );
        }
        if (entry.kind === "output") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
               className={`whitespace-pre-wrap ${entry.isError ? "text-red-500" : "text-text-soft"}`}
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
