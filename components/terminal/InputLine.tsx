"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PROMPT = "[you@portfolio ~]$ ";

interface Props {
  value: string;
  onType: (char: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function InputLine({ value, onType, onBackspace, onSubmit, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter")     { onSubmit(); return; }
    if (e.key === "Backspace") { onBackspace(); return; }
    if (e.key.length === 1)    { onType(e.key); }
  };

  return (
    <label
      className="flex items-center font-mono text-sm px-6 py-1 cursor-text"
    >
      <span className="text-primary glow-primary select-none">{PROMPT}</span>
      <span className="text-text-soft">{value}</span>
      <motion.span
        className="inline-block w-[9px] h-[1.1em] bg-primary ml-px"
        animate={{ opacity: disabled ? 0 : [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" as any }}
      />
      <input
        ref={inputRef}
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKey}
        readOnly
        aria-label="terminal input"
      />
    </label>
  );
}
