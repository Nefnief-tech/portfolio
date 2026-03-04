"use client";

import { useEffect, useRef } from "react";
import { useTerminalContext } from "@/lib/terminal/TerminalContext";
import type { Section } from "@/lib/terminal/types";
import { HistoryLog } from "./HistoryLog";
import { InputLine } from "./InputLine";
import { OutputRenderer } from "./OutputRenderer";

interface Props {
  onNavigate?: (s: Section | null) => void;
}

export function TerminalWindow({ onNavigate }: Props) {
  const { state, type, backspace, submit } = useTerminalContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const activeSection = state.activeSection;
  useEffect(() => {
    onNavigate?.(activeSection);
    if (!activeSection) return;
    window.history.replaceState(null, "", `/#${activeSection}`);
  }, [activeSection, onNavigate]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-surface/80 shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <span className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-4 text-muted text-xs font-mono">
          portfolio - bash
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <HistoryLog entries={state.history} />
        <OutputRenderer activeSection={state.activeSection} />
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border shrink-0 py-1">
        <InputLine
          value={state.currentCommand}
          onType={type}
          onBackspace={backspace}
          onSubmit={submit}
          disabled={state.isAnimating}
          status={state.isAnimating ? "printing" : "idle"}
        />
      </div>
    </div>
  );
}
