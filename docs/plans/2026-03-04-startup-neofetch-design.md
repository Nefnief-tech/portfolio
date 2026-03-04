# Startup transcript persistence + neofetch-like boot (design)

## Intent

Deliver a boot/startup experience that:

- Prints a neofetch-like profile block (pure ASCII logo + profile/system info)
- Shows the available commands immediately at startup (same formatting as `help`)
- Persists the startup transcript in the terminal scrollback after boot
- Disables input while boot output is printing and shows a "printing" indicator in the prompt

Constraints:

- Bun runtime
- Vinext/Next app router UI (client components)
- Dark purple terminal theme with kinetic motion (Framer Motion)
- Respect `prefers-reduced-motion` (skip animation, render final state)

## Current architecture (as-is)

- `app/page.tsx` gates between `<BootSequence />` and `<TerminalWindow />` via `booted`.
- `useTerminal()` owns terminal state (`history`, `currentCommand`, `activeSection`, `isAnimating`).
- `BootSequence` prints hardcoded `BOOT_LINES` visually, but does not feed the terminal history.
- `help` output is formatted in `useTerminal` reducer (SUBMIT → cmd.action === "help").

## Proposed architecture (recommended)

### 1) Startup transcript as pure helpers

Create `lib/terminal/startup.ts`:

- `buildCommandHelpText()` returns the exact same help formatting used by the `help` command.
- `buildStartupTranscript()` returns `{ lines: string[] }` containing:
  - Boot header lines ("PORTFOLIO OS …")
  - A neofetch-like dual-column block:
    - Left: pure ASCII logo (static multi-line string)
    - Right: key/value info including `ABOUT.name` + `ABOUT.tagline` (and optionally location/stack)
  - A blank separator line
  - `buildCommandHelpText()` output (so commands are visible immediately)

Rationale: deterministic, testable, and reusable both for boot overlay and seeding history.

### 2) Seeding startup into terminal history

Extend `useTerminal` reducer with a new action:

- `SEED_HISTORY` (or `APPEND_OUTPUT_LINES`) that takes `lines: string[]` and appends them as `HistoryEntry` of kind `output` in order.

Expose an imperative helper from the hook:

- `seedHistory(lines: string[])`

Rationale: keeps BootSequence separate from terminal internals while allowing boot transcript persistence.

### 3) Boot overlay + persistence

Update page composition to keep the terminal mounted:

- Always render `<TerminalWindow />` so the history exists.
- Render `<BootSequence />` as an absolute overlay above it until boot completes.
- On completion:
  - `setAnimating(true)` while seeding transcript
  - `seedHistory(transcriptLines)`
  - `setAnimating(false)`
  - hide overlay

Reduced motion:

- If reduced motion, skip timed reveals and immediately seed transcript + hide overlay.

### 4) Typing/printing indicator

Update `InputLine` API to accept a status derived from `state.isAnimating`:

- When printing: hide blink caret, show a subtle `… printing` indicator (still monospace, purple accent)
- Input remains disabled during printing (decided)

### 5) Motion + accessibility

Motion (default):

- BootSequence reveals transcript lines progressively (line-by-line). Neofetch block uses a "dual-column sequential reveal" feel (logo wipe/slide + staggered info) but implemented in terminal text: staged emission of the combined lines.

Accessibility:

- The ASCII logo block should be `aria-hidden="true"` and the overall boot container should have an `aria-label` summary.
- Respect `prefers-reduced-motion` by skipping intervals and rendering final state.

## Testing strategy

- Unit tests (Bun) for `buildStartupTranscript()` content (already started in `lib/terminal/startup.test.ts`).
- Unit tests for reducer `SEED_HISTORY` behavior (append order, kind correctness).

## Non-goals

- Full character-by-character typing simulation for every line (line-level reveal is sufficient).
- Complex glitch matrix animation (explicitly not chosen).
