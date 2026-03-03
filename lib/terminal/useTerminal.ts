"use client";
import { useCallback, useReducer } from "react";
import { COMMANDS, closestCommand } from "./commands";
import type { HistoryEntry, Section, TerminalState } from "./types";

type Action =
  | { type: "TYPE"; char: string }
  | { type: "BACKSPACE" }
  | { type: "SUBMIT" }
  | { type: "CLEAR" }
  | { type: "SET_ANIMATING"; value: boolean }
  | { type: "NAVIGATE"; section: Section };

const PROMPT_PREFIX = "[you@portfolio ~]$ ";

function reducer(state: TerminalState, action: Action): TerminalState {
  switch (action.type) {
    case "TYPE":
      return { ...state, currentCommand: state.currentCommand + action.char };
    case "BACKSPACE":
      return { ...state, currentCommand: state.currentCommand.slice(0, -1) };
    case "CLEAR":
      return { ...state, history: [], activeSection: null };
    case "SET_ANIMATING":
      return { ...state, isAnimating: action.value };
    case "NAVIGATE":
      return { ...state, activeSection: action.section };
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
        return { ...state, currentCommand: "", history: [], activeSection: null };
      if (cmd.action === "easter")
        return {
          ...state,
          currentCommand: "",
          history: [
            ...state.history,
            inputEntry,
            { kind: "output", text: cmd.easterText! },
          ],
        };
      if (cmd.action === "help") {
        const lines = Object.entries(COMMANDS)
          .filter(
            ([, v]) =>
              v.action !== "easter" &&
              ![
                "?",
                "whoami",
                "ls projects",
                "cat skills.json",
                "./contact",
                "cls",
              ].includes(v.description)
          )
          .map(([k, v]) => `  ${k.padEnd(16)} -- ${v.description}`);
        return {
          ...state,
          currentCommand: "",
          history: [
            ...state.history,
            inputEntry,
            {
              kind: "output",
              text: ["Available commands:", ...lines].join("\n"),
            },
          ],
        };
      }
      return {
        ...state,
        currentCommand: "",
        activeSection: cmd.target!,
        history: [
          ...state.history,
          inputEntry,
          { kind: "section", section: cmd.target! },
        ],
      };
    }
  }
}

const INITIAL: TerminalState = {
  history: [],
  currentCommand: "",
  activeSection: null,
  isAnimating: false,
};

export function useTerminal() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const type = useCallback(
    (char: string) => dispatch({ type: "TYPE", char }),
    []
  );
  const backspace = useCallback(() => dispatch({ type: "BACKSPACE" }), []);
  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const navigate = useCallback(
    (s: Section) => dispatch({ type: "NAVIGATE", section: s }),
    []
  );
  const setAnimating = useCallback(
    (v: boolean) => dispatch({ type: "SET_ANIMATING", value: v }),
    []
  );

  return { state, type, backspace, submit, clear, navigate, setAnimating };
}
