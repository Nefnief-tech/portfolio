"use client";
import { useRef, useEffect } from "react";
import { useTerminal }      from "@/lib/terminal/useTerminal";
import { HistoryLog }       from "./HistoryLog";
import { OutputRenderer }   from "./OutputRenderer";
import { InputLine }        from "./InputLine";
import type { Section }     from "@/lib/terminal/types";

interface Props { onNavigate?: (s: Section) => void; }

export function TerminalWindow({ onNavigate }: Props) {
  const { state, type, backspace, submit, navigate } = useTerminal();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.history.length >= 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.history.length]);

  const handleNavigate = (s: Section) => {
    navigate(s);
    onNavigate?.(s);
    window.history.replaceState(null, "", `/#${s}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-surface/80 shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <span className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-4 text-muted text-xs font-mono">portfolio - bash</span>
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
        />
      </div>
    </div>
  );
}
