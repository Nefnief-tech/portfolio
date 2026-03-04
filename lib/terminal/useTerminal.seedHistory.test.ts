import { describe, expect, test } from "bun:test";
import type { TerminalState } from "./types";
import { INITIAL_TERMINAL_STATE, reduceTerminal } from "./useTerminal";

describe("reduceTerminal SEED_HISTORY", () => {
  test("appends output entries in order", () => {
    const next = reduceTerminal(INITIAL_TERMINAL_STATE, {
      type: "SEED_HISTORY",
      lines: ["a", "b"],
    });

    expect(next.history.slice(-2)).toEqual([
      { kind: "output", text: "a" },
      { kind: "output", text: "b" },
    ]);
  });

  test("preserves existing history", () => {
    const state: TerminalState = {
      ...INITIAL_TERMINAL_STATE,
      history: [{ kind: "output", text: "x" }],
    };

    const next = reduceTerminal(state, {
      type: "SEED_HISTORY",
      lines: ["y"],
    });

    expect(next.history).toEqual([
      { kind: "output", text: "x" },
      { kind: "output", text: "y" },
    ]);
  });
});
