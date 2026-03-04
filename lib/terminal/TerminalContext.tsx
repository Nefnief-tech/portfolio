"use client";

import { createContext, useContext } from "react";
import type { Section, TerminalState } from "./types";

export interface TerminalApi {
  state: TerminalState;
  type: (char: string) => void;
  backspace: () => void;
  submit: () => void;
  clear: () => void;
  navigate: (section: Section) => void;
  setAnimating: (value: boolean) => void;
  seedHistory: (lines: string[]) => void;
  clearGuiRequest: () => void;
}

const TerminalContext = createContext<TerminalApi | null>(null);

export function useTerminalContext(): TerminalApi {
  const ctx = useContext(TerminalContext);
  if (!ctx)
    throw new Error("useTerminalContext must be used within TerminalProvider");
  return ctx;
}

export const TerminalProvider = TerminalContext.Provider;
