# Boot Persistence + Neofetch Startup + Command Showcase + Typing Indicator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** After the initial boot, the startup transcript (including a neofetch-like profile block and an initial command list) remains visible in the terminal scrollback; terminal shows a typing indicator while it is “printing”.

**Architecture:** Boot is rendered as an overlay animation that produces a transcript. When complete, the transcript is appended into the terminal history and the interactive terminal becomes active. Terminal “printing” toggles `isAnimating`, which disables input and shows a typing indicator in the prompt.

**Tech Stack:** Vinext (Vite + RSC), React 19, framer-motion, Bun.

---

## Task 1: Restore clean baseline in worktree

**Files:**
- Modify: `components/terminal/TerminalWindow.tsx`
- Modify: `app/page.tsx`

**Step 1: Ensure `TerminalWindow.tsx` is a single valid component**
- Remove duplicate exports and broken JSX.
- Use `useTerminal()` return shape `{ state, type, backspace, submit, setAnimating, ... }`.

**Step 2: Ensure `app/page.tsx` renders `BootSequence` when `booted === false`**

**Step 3: Verify baseline**
Run:
```bash
bun test
bun run build
```
Expected: tests pass, build succeeds.

---

## Task 2: Create pure helpers for boot transcript + command list (TDD)

**Files:**
- Create: `lib/terminal/startup.ts`
- Create: `lib/terminal/startup.test.ts`
- Modify: `lib/terminal/commands.ts` (export helper if needed)

**Step 1 (RED): Write failing tests**

Test: startup transcript includes:
- boot header lines
- a neofetch block containing the ABOUT name + tagline
- a command list that includes core commands (about/projects/skills/contact/help/clear)

```ts
import { describe, expect, test } from "bun:test";
import { buildStartupTranscript, buildCommandHelpText } from "./startup";

describe("startup transcript", () => {
  test("includes neofetch profile and commands", () => {
    const { lines } = buildStartupTranscript();
    expect(lines.join("\n")).toContain("PORTFOLIO OS");
    expect(lines.join("\n")).toContain("Your Name");
    expect(lines.join("\n")).toContain("Available commands:");
    expect(lines.join("\n")).toContain("about");
    expect(lines.join("\n")).toContain("projects");
    expect(lines.join("\n")).toContain("skills");
    expect(lines.join("\n")).toContain("contact");
  });
});
```

**Step 2: Run tests to confirm failure**
Run: `bun test lib/terminal/startup.test.ts`
Expected: FAIL (module missing / functions missing).

**Step 3 (GREEN): Implement minimal helpers**

`buildCommandHelpText()` should reuse the same formatting as `help` command.

`buildStartupTranscript()` returns `{ lines: string[] }` combining boot + neofetch + commands.

**Step 4: Run tests to confirm pass**
Run: `bun test`
Expected: PASS.

---

## Task 3: Seed terminal history with startup transcript

**Files:**
- Modify: `lib/terminal/useTerminal.ts`

**Step 1 (RED): Add a reducer test or extend existing tests**
- Add a test that dispatching a `SEED_HISTORY` action appends output entries.

**Step 2 (GREEN): Implement action**
- Add reducer case `SEED_HISTORY` / `APPEND_OUTPUT` that appends `HistoryEntry` output lines.
- Expose `seedHistory(lines: string[])` from `useTerminal()`.

**Step 3: Verify**
Run: `bun test`

---

## Task 4: Boot overlay that persists transcript

**Files:**
- Modify: `components/terminal/BootSequence.tsx`
- Modify: `app/page.tsx`
- Modify: `components/terminal/TerminalWindow.tsx`

**Step 1: BootSequence uses transcript lines**
- Replace hard-coded `BOOT_LINES` with `buildStartupTranscript().lines`.
- On completion, call `onComplete(transcriptLines)`.

**Step 2: Page renders overlay**
- Render `TerminalWindow` always (so history exists).
- Render `BootSequence` as an absolutely-positioned overlay on top until done.
- When boot completes: call `seedHistory(transcriptLines)` and set `booted=true`.

**Step 3: Ensure startup transcript visible after boot**
- Boot overlay fades out; terminal scrollback contains transcript.

**Step 4: Verify**
Run: `bun run build`

---

## Task 5: Typing indicator / printing state

**Files:**
- Modify: `components/terminal/InputLine.tsx`
- Modify: `lib/terminal/useTerminal.ts`

**Step 1:** Add prop `status?: "idle" | "typing" | "printing"` to `InputLine` (or `statusText`).

**Step 2:** Drive it from `state.isAnimating`:
- When `isAnimating` is true, show `typing…` and hide caret blink or change it.
- Keep `disabled` while printing.

**Step 3:** Trigger `setAnimating(true)` during boot seeding + (optional) simulated output.

**Step 4:** Verify
- `bun run build`
- manual: prompt shows typing indicator while printing.

---

## Final Verification

Run:
```bash
bun test
bun run build
bun run dev
```

Expected:
- Dev server starts, boot overlay runs, then terminal interactive.
- Startup transcript remains visible.
- Commands shown at start.
- Typing indicator appears while printing.
