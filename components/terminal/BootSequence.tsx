"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildStartupTranscript,
  type TranscriptLine,
} from "@/lib/terminal/startup";

interface Props {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: Props) {
  const bootLines = useMemo(() => buildStartupTranscript().lines, []);
  const [visibleLines, setVisibleLines] = useState<TranscriptLine[]>([]);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const prefersReducedRef = useRef(prefersReduced);

  const handleComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current();
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, []);

  useEffect(() => {
    if (prefersReducedRef.current) {
      handleComplete();
      return;
    }
    const lines = bootLines;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= lines.length) {
        clearInterval(interval);
        setTimeout(handleComplete, 600);
        return;
      }
      const current = lines[i];
      i++;
      setVisibleLines((prev) => [...prev, current]);
      scrollToBottom();
    }, 220);
    return () => clearInterval(interval);
  }, [bootLines, handleComplete, scrollToBottom]);

  return (
    <motion.div
      ref={scrollRef}
      className="font-mono text-sm text-text-soft p-6 space-y-0.5 h-full overflow-y-auto"
    >
      {visibleLines.map((line, idx) => (
        <motion.div
          key={`boot-${idx.toString()}`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className={line.colorClass ?? "text-text-soft"}
        >
          {line.text || "\u00A0"}
        </motion.div>
      ))}
    </motion.div>
  );
}
