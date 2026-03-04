"use client";
import { useCallback, useReducer } from "react";
import { buildHelpText, COMMANDS, closestCommand } from "./commands";
import { buildStartupTranscript } from "./startup";
import type { HistoryEntry, Section, TerminalState } from "./types";

type Action =
  | { type: "TYPE"; char: string }
  | { type: "BACKSPACE" }
  | { type: "SUBMIT" }
  | { type: "CLEAR" }
  | { type: "SET_ANIMATING"; value: boolean }
  | { type: "SEED_HISTORY"; lines: string[] }
  | { type: "NAVIGATE"; section: Section }
  | { type: "CLEAR_GUI_REQUEST" };

const PROMPT_PREFIX = "[nefnief@portfolio ~]$ ";

export function reduceTerminal(
  state: TerminalState,
  action: Action,
): TerminalState {
  switch (action.type) {
    case "TYPE":
      return { ...state, currentCommand: state.currentCommand + action.char };
    case "BACKSPACE":
      return { ...state, currentCommand: state.currentCommand.slice(0, -1) };
    case "CLEAR":
      return { ...state, history: [], activeSection: null };
    case "SET_ANIMATING":
      return { ...state, isAnimating: action.value };
    case "SEED_HISTORY":
      return {
        ...state,
        history: [
          ...state.history,
          ...action.lines.map((text) => ({ kind: "output" as const, text })),
        ],
      };
    case "NAVIGATE":
      return { ...state, activeSection: action.section };
    case "CLEAR_GUI_REQUEST":
      return { ...state, guiRequested: false };
    case "SUBMIT": {
      const raw = state.currentCommand.trim().toLowerCase();
      const inputEntry: HistoryEntry = {
        kind: "input",
        text: PROMPT_PREFIX + state.currentCommand,
      };
      if (!raw)
        return {
          ...state,
          history: [...state.history, inputEntry],
          currentCommand: "",
        };

      const cmd = COMMANDS[raw];
      if (!cmd) {
        const suggestion = closestCommand(raw);
        const msg = suggestion
          ? `command not found: ${raw}. Did you mean '${suggestion}'?`
          : `command not found: ${raw}. Type 'help' for a list of commands.`;
        return {
          ...state,
          currentCommand: "",
          history: [
            ...state.history,
            inputEntry,
            { kind: "output", text: msg, isError: true },
          ],
        };
      }
      if (cmd.action === "clear")
        return {
          ...state,
          currentCommand: "",
          history: [],
          activeSection: null,
        };
      if (cmd.action === "easter") {
        if (!cmd.easterText)
          return {
            ...state,
            currentCommand: "",
            history: [
              ...state.history,
              inputEntry,
              {
                kind: "output",
                text: "internal error: easter command missing text",
                isError: true,
              },
            ],
          };
        return {
          ...state,
          currentCommand: "",
          history: [
            ...state.history,
            inputEntry,
            { kind: "output", text: cmd.easterText, colorClass: "term-yellow" },
          ],
        };
      }
      if (cmd.action === "gui")
        return {
          ...state,
          currentCommand: "",
          history: [
            ...state.history,
            inputEntry,
            {
              kind: "output",
              text: "Switching to GUI mode...",
              colorClass: "term-green-glow",
            },
          ],
          guiRequested: true,
        };
      if (cmd.action === "help")
        return {
          ...state,
          currentCommand: "",
          history: [
            ...state.history,
            inputEntry,
            {
              kind: "output",
              text: buildHelpText(),
              colorClass: "term-cyan",
            },
          ],
        };
      if (!cmd.target)
        return {
          ...state,
          currentCommand: "",
          history: [
            ...state.history,
            inputEntry,
            {
              kind: "output",
              text: "internal error: section command missing target",
              isError: true,
            },
          ],
        };

      return {
        ...state,
        currentCommand: "",
        activeSection: cmd.target,
        history: [
          ...state.history,
          inputEntry,
          { kind: "section", section: cmd.target },
        ],
      };
    }
  }
}

export const INITIAL_TERMINAL_STATE: TerminalState = {
  history: buildStartupTranscript().lines.map((line) => ({
    kind: "output",
    text: line.text,
    colorClass: line.colorClass,
  })),
  currentCommand: "",
  activeSection: null,
  isAnimating: false,
  guiRequested: false,
};

export function useTerminal() {
  const [state, dispatch] = useReducer(reduceTerminal, INITIAL_TERMINAL_STATE);

  const type = useCallback(
    (char: string) => dispatch({ type: "TYPE", char }),
    [],
  );
  const backspace = useCallback(() => dispatch({ type: "BACKSPACE" }), []);
  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const navigate = useCallback(
    (s: Section) => dispatch({ type: "NAVIGATE", section: s }),
    [],
  );
  const setAnimating = useCallback(
    (v: boolean) => dispatch({ type: "SET_ANIMATING", value: v }),
    [],
  );
  const seedHistory = useCallback(
    (lines: string[]) => dispatch({ type: "SEED_HISTORY", lines }),
    [],
  );
  const clearGuiRequest = useCallback(
    () => dispatch({ type: "CLEAR_GUI_REQUEST" }),
    [],
  );

  return {
    state,
    type,
    backspace,
    submit,
    clear,
    navigate,
    setAnimating,
    seedHistory,
    clearGuiRequest,
  };
}
