"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const PROMPT = "[you@portfolio ~]$ ";

interface Props {
  value: string;
  onType: (char: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  status?: "idle" | "printing";
}

export function InputLine({
  value,
  onType,
  onBackspace,
  onSubmit,
  disabled,
  status = "idle",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
    else inputRef.current?.blur();
  }, [disabled]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter") {
      onSubmit();
      return;
    }
    if (e.key === "Backspace") {
      onBackspace();
      return;
    }
    if (e.key.length === 1) onType(e.key);
  };

  return (
    <label className="flex items-center font-mono text-sm px-6 py-1 cursor-text">
      <span className="select-none">
        <span className="term-green-glow">[nefnief</span>
        <span className="text-text-soft">@</span>
        <span className="term-cyan">portfolio</span>
        <span className="text-text-soft"> </span>
        <span className="term-pink">~</span>
        <span className="text-text-soft">]$ </span>
      </span>
      {status === "printing" && (
        <span className="text-primary/80 glow-primary select-none mr-1">
          [printing…]
        </span>
      )}
      <span className="text-text">{value}</span>
      {status !== "printing" && (
        <motion.span
          className="inline-block w-[9px] h-[1.1em] bg-primary ml-[1px]"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
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
