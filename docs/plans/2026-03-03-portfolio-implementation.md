# Portfolio — The Living Terminal: Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal portfolio as a fully interactive terminal emulator with dark purple aesthetics, kinetic motion, and four content sections (about, projects, skills, contact).

**Architecture:** Single vinext (Next.js on Vite) app, single page with hash-based routing. All terminal state lives in a `useTerminal` hook. Sections are rendered as terminal command output inline. Dual-mode UX: keyboard typing OR floating nav clicks both trigger identical animations.

**Tech Stack:** vinext + Bun, TypeScript, Tailwind v4, Framer Motion, GSAP, JetBrains Mono, Space Grotesk, @tsparticles/react, vinext Server Actions for contact form.

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`

**Step 1: Scaffold vinext project with Bun**

```bash
# In /media/games/portfolio-26
bunx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-bun
```

Expected: project files created, `bun.lockb` present.

**Step 2: Install vinext and replace next**

```bash
bunx vinext init
# OR manually:
bun remove next && bun add vinext
# Replace "next" with "vinext" in package.json scripts
```

**Step 3: Install animation and UI dependencies**

```bash
bun add framer-motion gsap @gsap/react @tsparticles/react @tsparticles/slim
bun add -d @types/node
```

**Step 4: Install fonts**

```bash
bun add @fontsource/jetbrains-mono @fontsource/space-grotesk
```

**Step 5: Verify dev server starts**

```bash
bun run dev
```
Expected: `▲ vinext 0.1.x ready on http://localhost:3000`

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: scaffold vinext + bun project with deps"
```

---

## Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `app/globals.css`
- Create: `tailwind.config.ts` (update with custom tokens)

**Step 1: Set up CSS custom properties in globals.css**

```css
/* app/globals.css */
@import "tailwindcss";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/700.css";
@import "@fontsource/space-grotesk/400.css";
@import "@fontsource/space-grotesk/700.css";

:root {
  --bg:           #080010;
  --surface:      #0D0018;
  --primary:      #9B30FF;
  --accent:       #E040FB;
  --text:         #C8B4E8;
  --muted:        #5B4A73;
  --border:       #2A1A40;
  --glow-primary: 0 0 8px #9B30FF88, 0 0 20px #9B30FF44;
  --glow-accent:  0 0 8px #E040FB88;
}

* { box-sizing: border-box; }

html, body {
  background: var(--bg);
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
  overflow: hidden; /* terminal is internally scrollable */
  height: 100%;
}

/* CRT scanline texture */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* Phosphor glow on primary text */
.glow-primary { text-shadow: var(--glow-primary); }
.glow-accent  { text-shadow: var(--glow-accent); }
```

**Step 2: Extend Tailwind config with custom colors**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:      "var(--bg)",
        surface: "var(--surface)",
        primary: "var(--primary)",
        accent:  "var(--accent)",
        muted:   "var(--muted)",
        border:  "var(--border)",
        "text-soft": "var(--text)",
      },
      fontFamily: {
        mono:    ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "sans-serif"],
      },
    },
  },
} satisfies Config;
```

**Step 3: Verify colors appear correctly**

Open `http://localhost:3000` — background should be near-black purple, not white.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add design tokens and global styles"
```

---

## Task 3: Terminal Core — `useTerminal` Hook

**Files:**
- Create: `lib/terminal/types.ts`
- Create: `lib/terminal/commands.ts`
- Create: `lib/terminal/useTerminal.ts`

**Step 1: Define types**

```typescript
// lib/terminal/types.ts
export type Section = "about" | "projects" | "skills" | "contact";

export type HistoryEntry =
  | { kind: "input";  text: string }
  | { kind: "output"; text: string; isError?: boolean }
  | { kind: "section"; section: Section };

export interface TerminalState {
  history:        HistoryEntry[];
  currentCommand: string;
  activeSection:  Section | null;
  isAnimating:    boolean;
}
```

**Step 2: Define command registry**

```typescript
// lib/terminal/commands.ts
import type { Section } from "./types";

export interface CommandDef {
  description: string;
  action: "section" | "clear" | "help" | "easter";
  target?: Section;
  easterText?: string;
}

export const COMMANDS: Record<string, CommandDef> = {
  help:          { description: "List all commands",           action: "help" },
  "?":           { description: "Alias for help",              action: "help" },
  about:         { description: "Display about section",       action: "section", target: "about" },
  whoami:        { description: "Alias for about",             action: "section", target: "about" },
  projects:      { description: "List projects",               action: "section", target: "projects" },
  "ls projects": { description: "Alias for projects",          action: "section", target: "projects" },
  skills:        { description: "Show skills.json",            action: "section", target: "skills" },
  "cat skills.json": { description: "Alias for skills",        action: "section", target: "skills" },
  contact:       { description: "Open contact form",           action: "section", target: "contact" },
  "./contact":   { description: "Alias for contact",           action: "section", target: "contact" },
  clear:         { description: "Clear terminal",              action: "clear" },
  cls:           { description: "Alias for clear",             action: "clear" },
  exit:          { description: "...",                         action: "easter", easterText: "Nice try. You can't leave." },
  sudo:          { description: "...",                         action: "easter", easterText: "sudo: you are not worthy." },
};

// Simple Levenshtein for typo suggestions
export function closestCommand(input: string): string | null {
  const keys = Object.keys(COMMANDS);
  let best = Infinity, match: string | null = null;
  for (const k of keys) {
    const d = levenshtein(input.toLowerCase(), k);
    if (d < best && d <= 3) { best = d; match = k; }
  }
  return match;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}
```

**Step 3: Write the hook**

```typescript
// lib/terminal/useTerminal.ts
"use client";
import { useCallback, useReducer } from "react";
import { COMMANDS, closestCommand } from "./commands";
import type { HistoryEntry, Section, TerminalState } from "./types";

type Action =
  | { type: "TYPE";    char: string }
  | { type: "BACKSPACE" }
  | { type: "SUBMIT" }
  | { type: "CLEAR" }
  | { type: "SET_ANIMATING"; value: boolean }
  | { type: "NAVIGATE";  section: Section };

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
      const inputEntry: HistoryEntry = { kind: "input", text: PROMPT_PREFIX + state.currentCommand };
      if (!raw) return { ...state, history: [...state.history, inputEntry], currentCommand: "" };

      const cmd = COMMANDS[raw];
      if (!cmd) {
        const suggestion = closestCommand(raw);
        const msg = suggestion
          ? `command not found: ${raw}. Did you mean '${suggestion}'?`
          : `command not found: ${raw}. Type 'help' for a list of commands.`;
        return {
          ...state,
          currentCommand: "",
          history: [...state.history, inputEntry, { kind: "output", text: msg, isError: true }],
        };
      }
      if (cmd.action === "clear") return { ...state, currentCommand: "", history: [], activeSection: null };
      if (cmd.action === "easter") return {
        ...state,
        currentCommand: "",
        history: [...state.history, inputEntry, { kind: "output", text: cmd.easterText! }],
      };
      if (cmd.action === "help") {
        const lines = Object.entries(COMMANDS)
          .filter(([, v]) => v.action !== "easter" && !["?","whoami","ls projects","cat skills.json","./contact","cls"].includes(v.description))
          .map(([k, v]) => `  ${k.padEnd(16)} — ${v.description}`);
        return {
          ...state,
          currentCommand: "",
          history: [...state.history, inputEntry, { kind: "output", text: ["Available commands:", ...lines].join("\n") }],
        };
      }
      // section command
      return {
        ...state,
        currentCommand: "",
        activeSection: cmd.target!,
        history: [...state.history, inputEntry, { kind: "section", section: cmd.target! }],
      };
    }
  }
}

const INITIAL: TerminalState = {
  history:        [],
  currentCommand: "",
  activeSection:  null,
  isAnimating:    false,
};

export function useTerminal() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const type       = useCallback((char: string) => dispatch({ type: "TYPE", char }), []);
  const backspace  = useCallback(() => dispatch({ type: "BACKSPACE" }), []);
  const submit     = useCallback(() => dispatch({ type: "SUBMIT" }), []);
  const clear      = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const navigate   = useCallback((s: Section) => dispatch({ type: "NAVIGATE", section: s }), []);
  const setAnimating = useCallback((v: boolean) => dispatch({ type: "SET_ANIMATING", value: v }), []);

  return { state, type, backspace, submit, clear, navigate, setAnimating };
}
```

**Step 4: Write unit tests for command parser and Levenshtein**

```typescript
// lib/terminal/__tests__/commands.test.ts
import { describe, it, expect } from "bun:test";
import { COMMANDS, closestCommand } from "../commands";

describe("COMMANDS", () => {
  it("has help command", () => expect(COMMANDS.help).toBeDefined());
  it("about maps to section about", () => expect(COMMANDS.about.target).toBe("about"));
  it("clear maps to clear action", () => expect(COMMANDS.clear.action).toBe("clear"));
});

describe("closestCommand", () => {
  it("returns closest match for typo", () => expect(closestCommand("abut")).toBe("about"));
  it("returns null for totally unknown", () => expect(closestCommand("zzzzz")).toBeNull());
  it("returns exact match", () => expect(closestCommand("skills")).toBe("skills"));
});
```

**Step 5: Run tests**

```bash
bun test lib/terminal/__tests__/commands.test.ts
```
Expected: all 5 tests PASS.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add terminal core hook and command registry with tests"
```

---

## Task 4: Boot Sequence Component

**Files:**
- Create: `components/terminal/BootSequence.tsx`

**Step 1: Write the component**

```tsx
// components/terminal/BootSequence.tsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "█ PORTFOLIO OS v1.0.0 — booting...",
  "  > loading modules ........ [OK]",
  "  > mounting /home/you/ ....... [OK]",
  "  > starting shell ............... [OK]",
  "",
  "┌─────────────────────────────────────────┐",
  "│  Hi. I'm [Your Name].                   │",
  "│  Student. Builder. Tinkerer.            │",
  "│  Type 'help' to see what I've made.     │",
  "└─────────────────────────────────────────┘",
];

interface Props { onComplete: () => void; }

export function BootSequence({ onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => { setDone(true); setTimeout(onComplete, 400); }, 300);
        return;
      }
      setVisibleLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
    }, 220);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Skip on any keypress
  useEffect(() => {
    const skip = () => { setDone(true); onComplete(); };
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="font-mono text-sm text-text-soft p-6 space-y-0.5"
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {visibleLines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={line.startsWith("│") || line.startsWith("┌") || line.startsWith("└")
                ? "text-primary glow-primary"
                : line.includes("[OK]")
                  ? "text-primary"
                  : "text-text-soft"}
            >
              {line || "\u00A0"}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Verify visually**

Import into `app/page.tsx` temporarily and confirm boot sequence plays and skips on keypress.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add boot sequence component"
```

---

## Task 5: Input Line Component

**Files:**
- Create: `components/terminal/InputLine.tsx`

**Step 1: Write component**

```tsx
// components/terminal/InputLine.tsx
"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PROMPT = "[you@portfolio ~]$ ";

interface Props {
  value: string;
  onType: (char: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function InputLine({ value, onType, onBackspace, onSubmit, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep invisible input focused
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter")     { onSubmit(); return; }
    if (e.key === "Backspace") { onBackspace(); return; }
    if (e.key.length === 1)    { onType(e.key); }
  };

  return (
    <div
      className="flex items-center font-mono text-sm px-6 py-1 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-primary glow-primary select-none">{PROMPT}</span>
      <span className="text-text-soft">{value}</span>
      {/* Blinking block cursor */}
      <motion.span
        className="inline-block w-[9px] h-[1.1em] bg-primary ml-px"
        animate={{ opacity: disabled ? 0 : [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
      />
      {/* Hidden input to capture keyboard on mobile too */}
      <input
        ref={inputRef}
        className="absolute opacity-0 w-0 h-0"
        onKeyDown={handleKey}
        readOnly
        aria-label="terminal input"
      />
    </div>
  );
}
```

**Step 2: Verify**

Wire temporarily into page.tsx. Confirm: typing shows text, backspace removes, enter triggers submit callback.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add terminal input line with blinking cursor"
```

---

## Task 6: History Log Renderer

**Files:**
- Create: `components/terminal/HistoryLog.tsx`

**Step 1: Write component**

```tsx
// components/terminal/HistoryLog.tsx
"use client";
import { motion } from "framer-motion";
import type { HistoryEntry } from "@/lib/terminal/types";

interface Props { entries: HistoryEntry[]; }

export function HistoryLog({ entries }: Props) {
  return (
    <div className="font-mono text-sm px-6 space-y-1 overflow-y-auto">
      {entries.map((entry, idx) => {
        if (entry.kind === "input") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted"
            >
              {entry.text}
            </motion.div>
          );
        }
        if (entry.kind === "output") {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`whitespace-pre-wrap ${entry.isError ? "text-red-400" : "text-text-soft"}`}
            >
              {entry.text}
            </motion.div>
          );
        }
        // section entries render nothing here — handled by OutputRenderer
        return null;
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add history log renderer"
```

---

## Task 7: About Panel

**Files:**
- Create: `components/sections/AboutPanel.tsx`
- Create: `lib/content/about.ts`

**Step 1: Define content**

```typescript
// lib/content/about.ts
export const ABOUT = {
  name: "Your Name",
  tagline: "Student. Builder. Tinkerer.",
  location: "Your City",
  bio: [
    "I build things to understand them.",
    "",
    "Currently exploring:",
    "  → systems programming (Rust, C)",
    "  → creative coding (WebGL, p5.js)",
    "  → full-stack web (vinext, Hono, Bun)",
    "",
    "When I'm not coding: [hobby], [hobby].",
  ],
  links: [
    { label: "github",   href: "https://github.com/yourhandle" },
    { label: "twitter",  href: "https://twitter.com/yourhandle" },
    { label: "linkedin", href: "https://linkedin.com/in/yourhandle" },
  ],
};
```

**Step 2: Write panel component**

```tsx
// components/sections/AboutPanel.tsx
"use client";
import { motion } from "framer-motion";
import { ABOUT } from "@/lib/content/about";

const LINE_DELAY = 0.04; // seconds between lines

export function AboutPanel() {
  const lines = [
    `> cat about.md`,
    ``,
    `## ${ABOUT.name}`,
    ABOUT.tagline,
    `📍 ${ABOUT.location}`,
    ``,
    ...ABOUT.bio,
    ``,
    ...ABOUT.links.map(l => `  [${l.label}] ${l.href}`),
  ];

  return (
    <div className="px-6 py-3 font-mono text-sm space-y-0.5">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * LINE_DELAY, duration: 0.15 }}
          className={
            line.startsWith("##")
              ? "text-accent font-bold text-base glow-accent"
              : line.startsWith(">")
                ? "text-muted"
                : line.startsWith("  [")
                  ? "text-primary underline glow-primary cursor-pointer hover:text-accent"
                  : "text-text-soft"
          }
        >
          {line || "\u00A0"}
        </motion.div>
      ))}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add about panel with staggered line reveal"
```

---

## Task 8: Projects Data + Card

**Files:**
- Create: `lib/content/projects.ts`
- Create: `components/sections/ProjectCard.tsx`
- Create: `components/sections/ProjectsGrid.tsx`

**Step 1: Define projects content**

```typescript
// lib/content/projects.ts
export interface Project {
  id:          string;
  name:        string;
  description: string;
  tags:        string[];
  githubUrl?:  string;
  liveUrl?:    string;
  detail:      string[]; // lines for expanded view
}

export const PROJECTS: Project[] = [
  {
    id: "project-one",
    name: "project-one",
    description: "A short description of what this does",
    tags: ["TypeScript", "Bun", "Hono"],
    githubUrl: "https://github.com/you/project-one",
    detail: [
      "## project-one",
      "",
      "Full description. Why you built it, what you learned.",
      "",
      "Built with TypeScript, Bun, and Hono. Deployed on Cloudflare Workers.",
    ],
  },
  // Add more projects here
];
```

**Step 2: Write ProjectCard**

```tsx
// components/sections/ProjectCard.tsx
"use client";
import { motion } from "framer-motion";
import type { Project } from "@/lib/content/projects";

interface Props {
  project:  Project;
  onExpand: (id: string) => void;
  delay:    number;
}

export function ProjectCard({ project, onExpand, delay }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2, type: "spring", stiffness: 120, damping: 14 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 16px #9B30FF55" }}
      onClick={() => onExpand(project.id)}
      className="border border-border rounded-md p-4 cursor-pointer bg-surface/60 hover:border-primary transition-colors"
    >
      <div className="text-primary glow-primary font-bold mb-1">{project.name}</div>
      <div className="text-text-soft text-xs mb-3">{project.description}</div>
      <div className="flex flex-wrap gap-1">
        {project.tags.map(tag => (
          <span key={tag} className="text-muted text-xs font-mono">[{tag}]</span>
        ))}
      </div>
      <div className="flex gap-3 mt-3">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener"
            className="text-muted text-xs hover:text-primary"
            onClick={e => e.stopPropagation()}
          >github ↗</a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener"
            className="text-muted text-xs hover:text-accent"
            onClick={e => e.stopPropagation()}
          >live ↗</a>
        )}
      </div>
    </motion.div>
  );
}
```

**Step 3: Write ProjectsGrid**

```tsx
// components/sections/ProjectsGrid.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/lib/content/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const project = PROJECTS.find(p => p.id === expanded);

  return (
    <div className="px-6 py-3 font-mono text-sm">
      <motion.div
        className="text-muted mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {`> ls ~/projects`}
      </motion.div>

      <AnimatePresence mode="wait">
        {expanded && project ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-0.5"
          >
            <button
              className="text-muted hover:text-primary mb-3 text-xs"
              onClick={() => setExpanded(null)}
            >← back to projects</button>
            {project.detail.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={line.startsWith("##") ? "text-accent font-bold text-base" : "text-text-soft"}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p} onExpand={setExpanded} delay={i * 0.07} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add projects grid with expandable cards"
```

---

## Task 9: Skills JSON Panel

**Files:**
- Create: `lib/content/skills.ts`
- Create: `components/sections/SkillsPanel.tsx`

**Step 1: Define skills content**

```typescript
// lib/content/skills.ts
export const SKILLS: Record<string, string[]> = {
  languages:  ["TypeScript", "Python", "Rust", "Go", "C"],
  frontend:   ["React", "Next.js / vinext", "Svelte", "Tailwind"],
  backend:    ["Bun", "Hono", "Node.js", "PostgreSQL", "Redis"],
  tools:      ["Docker", "Git", "Linux", "Neovim"],
  learning:   ["WebGL / Three.js", "Zig", "Distributed systems"],
};
```

**Step 2: Write SkillsPanel**

```tsx
// components/sections/SkillsPanel.tsx
"use client";
import { motion } from "framer-motion";
import { SKILLS } from "@/lib/content/skills";

export function SkillsPanel() {
  // Flatten to an array of { key?, value, indent, color }
  type Line = { text: string; color: string; delay: number };
  const lines: Line[] = [];
  let delay = 0;

  const push = (text: string, color: string) => {
    lines.push({ text, color, delay });
    delay += 0.025;
  };

  push(`> cat skills.json`, "text-muted");
  push(``, "text-text-soft");
  push(`{`, "text-text-soft");
  Object.entries(SKILLS).forEach(([key, vals], i, arr) => {
    const comma = i < arr.length - 1 ? "," : "";
    push(`  "${key}": [`, "text-accent");
    vals.forEach((v, vi) => {
      const isLast = vi === vals.length - 1;
      push(`    "${v}"${isLast ? "" : ","}`, "text-text-soft");
    });
    push(`  ]${comma}`, "text-muted");
  });
  push(`}`, "text-text-soft");

  return (
    <div className="px-6 py-3 font-mono text-sm space-y-0.5">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: l.delay, duration: 0.12 }}
          className={l.color}
        >
          {l.text || "\u00A0"}
        </motion.div>
      ))}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add skills JSON panel with staggered reveal"
```

---

## Task 10: Contact Panel + Server Action

**Files:**
- Create: `components/sections/ContactPanel.tsx`
- Create: `app/actions/contact.ts`

**Step 1: Write server action**

```typescript
// app/actions/contact.ts
"use server";

export interface ContactPayload {
  name:    string;
  email:   string;
  message: string;
}

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  // Validate
  if (!payload.name || !payload.email || !payload.message) {
    return { ok: false, error: "All fields required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "Invalid email address." };
  }

  // TODO: plug in your preferred delivery (Resend, Nodemailer, etc.)
  // For now, just log server-side
  console.log("[contact]", payload);

  return { ok: true };
}
```

**Step 2: Write ContactPanel**

```tsx
// components/sections/ContactPanel.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { sendContact } from "@/app/actions/contact";

export function ContactPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await sendContact(form);
    if (res.ok) {
      setStatus("ok");
    } else {
      setStatus("error");
      setErrorMsg(res.error ?? "Unknown error.");
    }
  };

  const inputClass = "bg-transparent border-b border-border text-text-soft font-mono text-sm focus:outline-none focus:border-primary w-full py-0.5 placeholder:text-muted transition-colors";

  return (
    <div className="px-6 py-3 font-mono text-sm">
      <motion.div className="text-muted mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {`> ./contact.sh`}
      </motion.div>

      {status === "ok" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary glow-primary"
        >
          &gt; Message sent. [OK]
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border border-border rounded-md p-4 space-y-3 max-w-md bg-surface/60"
        >
          {/* Name */}
          <div className="flex items-center gap-2">
            <span className="text-muted w-16">name:</span>
            <input
              className={inputClass}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="your name"
              disabled={status === "sending"}
            />
          </div>
          {/* Email */}
          <div className="flex items-center gap-2">
            <span className="text-muted w-16">email:</span>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              disabled={status === "sending"}
            />
          </div>
          {/* Message */}
          <div className="flex gap-2">
            <span className="text-muted w-16 pt-0.5">msg:</span>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="what's on your mind?"
              disabled={status === "sending"}
            />
          </div>

          {status === "error" && (
            <div className="text-red-400 text-xs">{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="text-primary glow-primary hover:text-accent transition-colors disabled:opacity-50"
          >
            {status === "sending" ? "> sending..." : "> [send message]"}
          </button>
        </motion.form>
      )}
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add contact panel with server action"
```

---

## Task 11: Output Renderer

**Files:**
- Create: `components/terminal/OutputRenderer.tsx`

**Step 1: Write component**

```tsx
// components/terminal/OutputRenderer.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { Section } from "@/lib/terminal/types";
import { AboutPanel }    from "@/components/sections/AboutPanel";
import { ProjectsGrid }  from "@/components/sections/ProjectsGrid";
import { SkillsPanel }   from "@/components/sections/SkillsPanel";
import { ContactPanel }  from "@/components/sections/ContactPanel";

interface Props { activeSection: Section | null; }

const PANELS: Record<Section, React.ComponentType> = {
  about:    AboutPanel,
  projects: ProjectsGrid,
  skills:   SkillsPanel,
  contact:  ContactPanel,
};

export function OutputRenderer({ activeSection }: Props) {
  const Panel = activeSection ? PANELS[activeSection] : null;

  return (
    <AnimatePresence mode="wait">
      {Panel && (
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <Panel />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add output renderer wiring all section panels"
```

---

## Task 12: Particle Background

**Files:**
- Create: `components/ParticleBackground.tsx`

**Step 1: Write component**

```tsx
// components/ParticleBackground.tsx
"use client";
import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export function ParticleBackground() {
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={init}
      className="fixed inset-0 -z-10"
      options={{
        background: { color: { value: "#080010" } },
        fpsLimit: 60,
        particles: {
          number:   { value: 60, density: { enable: true, area: 800 } },
          color:    { value: ["#9B30FF", "#E040FB", "#5B4A73"] },
          opacity:  { value: { min: 0.05, max: 0.25 } },
          size:     { value: { min: 1, max: 2 } },
          move:     { enable: true, speed: 0.4, direction: "none", random: true, outModes: "out" },
          links:    { enable: true, color: "#2A1A40", distance: 120, opacity: 0.15, width: 1 },
        },
        detectRetina: true,
      }}
    />
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add ambient particle background"
```

---

## Task 13: Floating Nav Sidebar

**Files:**
- Create: `components/terminal/FloatingNav.tsx`

**Step 1: Write component**

```tsx
// components/terminal/FloatingNav.tsx
"use client";
import { motion } from "framer-motion";
import type { Section } from "@/lib/terminal/types";

const NAV: { section: Section; icon: string; label: string }[] = [
  { section: "about",    icon: "◉", label: "about" },
  { section: "projects", icon: "▦", label: "projects" },
  { section: "skills",   icon: "⟨⟩", label: "skills" },
  { section: "contact",  icon: "✉", label: "contact" },
];

interface Props {
  active:   Section | null;
  onSelect: (s: Section) => void;
}

export function FloatingNav({ active, onSelect }: Props) {
  return (
    <motion.nav
      className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3, duration: 0.4 }}
    >
      {NAV.map(({ section, icon, label }) => (
        <motion.button
          key={section}
          onClick={() => onSelect(section)}
          whileHover={{ scale: 1.15, x: -4 }}
          className={`w-9 h-9 rounded border font-mono text-sm flex items-center justify-center transition-colors ${
            active === section
              ? "border-primary text-primary bg-primary/10"
              : "border-border text-muted hover:border-primary hover:text-primary"
          }`}
          title={label}
          aria-label={label}
        >
          {icon}
        </motion.button>
      ))}
    </motion.nav>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add floating nav sidebar"
```

---

## Task 14: Assemble TerminalOS — Main Page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/terminal/TerminalWindow.tsx`

**Step 1: Write TerminalWindow**

```tsx
// components/terminal/TerminalWindow.tsx
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

  // Auto-scroll to bottom on new history
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.history]);

  const handleNavigate = (s: Section) => {
    navigate(s);
    onNavigate?.(s);
    // Sync URL hash
    window.history.replaceState(null, "", `/#${s}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Terminal chrome — top bar */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-surface/80 shrink-0">
        <span className="w-3 h-3 rounded-full bg-red-500/60" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <span className="w-3 h-3 rounded-full bg-green-500/60" />
        <span className="ml-4 text-muted text-xs font-mono">portfolio — bash</span>
      </div>

      {/* Scrollable output area */}
      <div className="flex-1 overflow-y-auto py-2">
        <HistoryLog entries={state.history} />
        <OutputRenderer activeSection={state.activeSection} />
        <div ref={bottomRef} />
      </div>

      {/* Input line always at bottom */}
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
```

**Step 2: Write main page**

```tsx
// app/page.tsx
"use client";
import { useState } from "react";
import { BootSequence }      from "@/components/terminal/BootSequence";
import { TerminalWindow }    from "@/components/terminal/TerminalWindow";
import { FloatingNav }       from "@/components/terminal/FloatingNav";
import { ParticleBackground } from "@/components/ParticleBackground";
import type { Section }       from "@/lib/terminal/types";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <ParticleBackground />

      {/* Terminal window — centered, max-width container */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[90vh] rounded-xl border border-border bg-surface/90 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10">
          {!booted ? (
            <BootSequence onComplete={() => setBooted(true)} />
          ) : (
            <TerminalWindow onNavigate={setActiveSection} />
          )}
        </div>
      </div>

      {/* Floating nav — appears after boot */}
      {booted && (
        <FloatingNav
          active={activeSection}
          onSelect={(s) => {
            setActiveSection(s);
            // FloatingNav click dispatches same as typing the command
            // TerminalWindow will handle via its own navigate
          }}
        />
      )}
    </main>
  );
}
```

**Step 3: Verify full flow**

- Boot sequence plays, skip works
- After boot: input line active, typing works, enter submits
- `help` prints command list
- `about` / `projects` / `skills` / `contact` all render their panels
- Floating nav visible, clicking triggers section
- Particles visible in background

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: assemble full terminal OS — main page"
```

---

## Task 15: Accessibility + Reduced Motion

**Files:**
- Modify: `app/globals.css`
- Modify: `components/terminal/BootSequence.tsx`

**Step 1: Add reduced motion CSS**

```css
/* Append to app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Skip boot sequence on reduced motion**

```tsx
// In BootSequence.tsx — wrap the boot timer in a check
const prefersReduced = typeof window !== "undefined"
  && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

useEffect(() => {
  if (prefersReduced) { onComplete(); return; }
  // ... existing timer
}, [onComplete, prefersReduced]);
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add prefers-reduced-motion support"
```

---

## Task 16: Update Layout + Metadata

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update root layout**

```tsx
// app/layout.tsx
import type { Metadata } from "vinext";
import "./globals.css";

export const metadata: Metadata = {
  title: "[Your Name] — Portfolio",
  description: "Student. Builder. Tinkerer.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "[Your Name]",
    description: "Student. Builder. Tinkerer.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: update layout metadata"
```

---

## Task 17: Production Build + Deploy

**Files:**
- Create: `wrangler.jsonc` (auto-generated by vinext)

**Step 1: Run production build**

```bash
bun run build
```
Expected: build completes without errors.

**Step 2: Preview locally**

```bash
bun run start
```
Verify at `http://localhost:3000` — all sections functional, no console errors.

**Step 3: Deploy to Cloudflare Workers**

```bash
bunx vinext deploy
```
Expected output:
```
Building... ✓
Deploying to Cloudflare Workers... ✓ deployed
Live at your-portfolio.workers.dev
```

**Step 4: Final commit**

```bash
git add -A && git commit -m "chore: production build verified, deploy config complete"
```

---

## Execution Order

Tasks 1–2 must run sequentially (scaffold, then styles). Tasks 3–13 can be parallelized into two streams:

**Stream A** (core logic): 3 → 5 → 6 → 11 → 14  
**Stream B** (content/sections): 4 → 7 → 8 → 9 → 10 → 12 → 13

Tasks 15–17 run after both streams converge.
