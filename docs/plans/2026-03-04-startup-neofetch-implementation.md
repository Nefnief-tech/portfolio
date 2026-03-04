# Startup transcript persistence + neofetch boot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Boot prints a neofetch-like profile + command list, then that startup transcript persists in terminal scrollback; input is disabled while printing and shows a printing indicator.

**Architecture:** Render `TerminalWindow` continuously; render `BootSequence` as an overlay that animates the startup transcript. On completion, seed the transcript into `useTerminal` history (output entries) and dismiss the overlay. `state.isAnimating` drives input disabling + prompt printing indicator.

**Tech Stack:** Vinext/Next (app router), React (client components), framer-motion, Bun.

---

### Task 1: Create startup transcript helpers (TDD)

**Files:**
- Create: `.worktrees/boot-neofetch/lib/terminal/startup.ts`
- Test: `.worktrees/boot-neofetch/lib/terminal/startup.test.ts`

**Step 1: Confirm the test currently fails**

Run (worktree):
```bash
bun test lib/terminal/startup.test.ts
```
Expected: FAIL (module `./startup` missing or export missing).

**Step 2: Implement minimal `buildStartupTranscript()` to make test pass**

Implement:
- Import `ABOUT` from `lib/content/about.ts`
- Construct `lines: string[]` with:
  - Boot header line containing `PORTFOLIO OS`
  - Neofetch block including `ABOUT.name` and `ABOUT.tagline`
  - `Available commands:` section showing `help/about/projects/skills/contact/clear`

**Step 3: Run tests to confirm pass**

Run:
```bash
bun test lib/terminal/startup.test.ts
```
Expected: PASS.

---

### Task 2: Reuse exact help formatting for startup command list

**Files:**
- Modify: `.worktrees/boot-neofetch/lib/terminal/useTerminal.ts`
- Modify: `.worktrees/boot-neofetch/lib/terminal/commands.ts` (if needed)
- Modify: `.worktrees/boot-neofetch/lib/terminal/startup.ts`
- Test: `.worktrees/boot-neofetch/lib/terminal/startup.test.ts`

**Step 1: Extract help text builder**

Create a pure helper (either in `startup.ts` or `commands.ts`) that builds the same help text currently assembled inline in the reducer:

```ts
export function buildHelpText(): string {
  const lines = Object.entries(COMMANDS)
    .filter(([k, v]) => v.action !== "easter" && !["?", "whoami", "ls projects", "cat skills.json", "./contact", "cls"].includes(k))
    .map(([k, v]) => `  ${k.padEnd(16)} -- ${v.description}`);
  return ["Available commands:", ...lines].join("\n");
}
```

**Step 2: Use the helper in both places**

- In reducer `help` action: set output text to `buildHelpText()`
- In startup transcript: include `buildHelpText()` output in transcript lines (split by `\n`)

**Step 3: Update test assertions if needed**

Ensure the startup test still passes and verifies it contains the core commands.

**Step 4: Run all tests**

Run:
```bash
bun test
```
Expected: PASS.

---

### Task 3: Add history seeding action to `useTerminal` (TDD)

**Files:**
- Modify: `.worktrees/boot-neofetch/lib/terminal/useTerminal.ts`
- Create/Test: `.worktrees/boot-neofetch/lib/terminal/useTerminal.seedHistory.test.ts`

**Step 1: Write failing reducer test**

Because `useTerminal` is a hook, export the reducer (or a small pure function) to test seeding deterministically without React.

Example test shape:

```ts
import { describe, expect, test } from "bun:test";
import { reduceTerminal, INITIAL_TERMINAL_STATE } from "./useTerminal";

test("SEED_HISTORY appends output entries", () => {
  const next = reduceTerminal(INITIAL_TERMINAL_STATE, { type: "SEED_HISTORY", lines: ["a", "b"] });
  expect(next.history).toEqual([
    { kind: "output", text: "a" },
    { kind: "output", text: "b" },
  ]);
});
```

Expected: FAIL (exports/action missing).

**Step 2: Implement `SEED_HISTORY`**

- Add Action union variant: `{ type: "SEED_HISTORY"; lines: string[] }`
- Reducer case appends `{ kind: "output", text: line }` for each line, preserving existing history.

**Step 3: Export a testable reducer surface**

- Export `reduceTerminal` and `INITIAL_TERMINAL_STATE` (or equivalent) from `useTerminal.ts`.

**Step 4: Expose `seedHistory(lines)` from the hook**

- `const seedHistory = useCallback((lines: string[]) => dispatch({ type: "SEED_HISTORY", lines }), []);`
- Return it.

**Step 5: Run tests**

Run:
```bash
bun test
```
Expected: PASS.

---

### Task 4: Make boot an overlay and persist transcript into history

**Files:**
- Modify: `.worktrees/boot-neofetch/app/page.tsx`
- Modify: `.worktrees/boot-neofetch/components/terminal/BootSequence.tsx`
- Modify: `.worktrees/boot-neofetch/components/terminal/TerminalWindow.tsx`
- Modify: `.worktrees/boot-neofetch/lib/terminal/useTerminal.ts` (if `TerminalWindow` needs new hook return)

**Step 1: Change BootSequence API**

- Update props to `onComplete: (lines: string[]) => void`
- Use `buildStartupTranscript().lines` instead of local `BOOT_LINES`
- Keep skip-on-keypress and reduced-motion behavior

**Step 2: Render TerminalWindow always + overlay BootSequence**

- In `app/page.tsx`, always render `TerminalWindow`.
- Overlay `BootSequence` with `position: absolute` inside the terminal frame.
- While overlay is present, set `state.isAnimating` to true (so input disables and shows indicator).

Implementation detail: `page.tsx` currently doesn’t have access to terminal actions because `useTerminal` is used inside `TerminalWindow`. Introduce a `TerminalProvider` (React context) or lift `useTerminal` to `page.tsx` and pass props down.

Recommended: create `TerminalProvider` so both `TerminalWindow` and `page.tsx` can share the same terminal state/actions.

**Step 3: Seed transcript and dismiss overlay**

- On boot complete: call `seedHistory(lines)` then hide overlay.
- Ensure transcript remains in `HistoryLog` afterward.

**Step 4: Verify manual flow**

Run:
```bash
bun run dev
```
Expected:
- Boot overlay prints neofetch + commands
- After boot ends, the same transcript is visible in history

---

### Task 5: Typing/printing indicator in the prompt (no type suppression)

**Files:**
- Modify: `.worktrees/boot-neofetch/components/terminal/InputLine.tsx`
- Modify: `.worktrees/boot-neofetch/components/terminal/TerminalWindow.tsx`

**Step 1: Remove `as any` in InputLine caret animation**

Currently:
- `ease: "steps(1)" as any` violates type-safety constraint.

Fix:
- Use a typed `Easing` or change caret animation to a supported framer-motion config without casts.

**Step 2: Add status text when printing**

- Add prop `status?: "idle" | "printing"`.
- When `status === "printing"`, hide caret blink and show a subtle `[printing…]` indicator after the prompt.

**Step 3: Drive status from terminal state**

- In TerminalWindow: `status={state.isAnimating ? "printing" : "idle"}`

**Step 4: Verify**

Run:
```bash
bun run build
```
Expected: PASS.

---

### Final verification

Run (worktree):
```bash
bun test
bun run build
```

Manual:
```bash
bun run dev
```

Expected:
- Startup transcript is visible in history after boot
- Commands shown at start match `help` formatting
- Input disabled during printing + shows printing indicator
