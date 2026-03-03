# Portfolio Design: The Living Terminal

**Date**: 2026-03-03  
**Status**: Approved  
**Stack**: vinext (Next.js API on Vite) + Bun + TypeScript + Tailwind v4 + Framer Motion + GSAP

---

## Overview

A personal portfolio for a student / "try everything" developer built as a fully interactive terminal emulator. The terminal is not a gimmick — it's the entire UI. Content is revealed through commands (typed or clicked), all transitions are kinetic, and the visual language is dark purple + neon with a CRT phosphor aesthetic.

**Identity**: Student, builder, tinkerer. Breadth over depth. Curiosity as the brand.

---

## Visual Identity

| Token | Value | Usage |
|---|---|---|
| Background | `#080010` | Page background |
| Terminal surface | `#0D0018` | Terminal window |
| Primary glow | `#9B30FF` | Accent text, borders, cursor |
| Neon accent | `#E040FB` | Highlights, hover states |
| Text | `#C8B4E8` | Body / output text |
| Muted | `#5B4A73` | Comments, secondary info |
| Font — mono | `JetBrains Mono` | All terminal text |
| Font — display | `Space Grotesk` | ASCII headers, titles |

**Texture**: CRT scanlines via `repeating-linear-gradient` at 3% opacity over terminal surface. Phosphor glow on text via `text-shadow`. Background has slow-drifting particle system.

**Cursor**: Blinking block (`█`) via CSS keyframe animation. Respects `prefers-reduced-motion`.

---

## Architecture

### Routing

Single-page app. URL hash reflects current terminal state:
- `/` → boot / initial prompt
- `/#about` → about section active
- `/#projects` → projects grid active
- `/#skills` → skills JSON active
- `/#contact` → contact panel active

Browser back/forward replays the terminal command animation.

### Component Tree

```
<TerminalOS>
  ├── <BootSequence />          # Plays once on first load
  ├── <TerminalWindow>
  │   ├── <HistoryLog />        # Scrollable command history
  │   ├── <OutputRenderer />    # Renders command output panels
  │   │   ├── <AboutPanel />
  │   │   ├── <ProjectsGrid />
  │   │   │   └── <ProjectCard />
  │   │   ├── <SkillsJSON />
  │   │   └── <ContactPanel />
  │   └── <InputLine />         # Active prompt + text input
  ├── <FloatingNav />           # Mouse-accessible icon sidebar
  └── <ParticleBackground />    # Ambient particle layer
```

### State

All terminal state lives in a single `useTerminal` hook:
- `history: HistoryEntry[]` — rendered command log
- `currentCommand: string` — live input buffer
- `activeSection: Section | null` — currently displayed panel
- `isTyping: boolean` — animating flag (blocks input during typewriter)

---

## Boot Sequence

Plays automatically on first load. Duration: ~2.5s. Skippable with any keypress.

```
█ PORTFOLIO OS v1.0.0 — booting...
  > loading modules ........ [OK]
  > mounting /home/[name]/ ..... [OK]
  > starting shell ............... [OK]

┌─────────────────────────────────────────┐
│  Hi. I'm [Name].                        │
│  Student. Builder. Tinkerer.            │
│  Type 'help' to see what I've made.     │
└─────────────────────────────────────────┘

[name@portfolio ~]$ █
```

Lines appear with a character-by-character typewriter animation (variable speed: 30–60ms/char). Box border draws in last for drama.

---

## Command System

| Command | Aliases | Output |
|---|---|---|
| `help` | `?` | Lists all available commands |
| `about` | `whoami` | Bio + tagline panel |
| `ls projects` | `projects` | Project card grid |
| `cat skills.json` | `skills` | Animated JSON tree |
| `./contact` | `contact` | Contact form panel |
| `clear` | `cls` | Wipes history with animation |
| `exit` | — | Easter egg response |
| `sudo` | — | Humorous easter egg |

**Implementation**: Commands are parsed from the input string, matched against a `COMMANDS` registry (plain object), and dispatched to the appropriate panel renderer. Unknown commands print a helpful error with suggestions (Levenshtein distance matching for typo correction).

**Dual-mode UX**:
- Keyboard users type directly into the input line
- Mouse/touch users use the floating nav sidebar (icon buttons that trigger commands)
- Both paths produce identical animations

---

## Section Designs

### About Panel

Triggered by `about` or `whoami`. Renders as terminal "file output":

```
> cat about.md

## [Name]
Student & developer based in [City].

I build things to understand them. Currently exploring:
→ systems programming (Rust, C)
→ creative coding (WebGL, p5.js)
→ full-stack web (vinext, Hono, Bun)

When I'm not coding: [hobby], [hobby].
```

Lines stagger in at 40ms intervals. External links are neon-colored and underlined.

### Projects Grid

Triggered by `ls projects`. Renders a 2-column responsive card grid *within* the terminal output area:

Each `<ProjectCard>`:
- **Name**: monospace, `#9B30FF` glow
- **Description**: one line, muted text
- **Tech tags**: `[tag]` format, dimmed
- **Links**: GitHub icon + live link icon
- **Hover**: scale 1.02, neon border glow intensifies, slight perspective tilt

Clicking a card triggers `cat projects/[name].md` inline — expands a detail panel with: full description, screenshot/preview, tech rationale, links.

Cards animate in with staggered `opacity 0 → 1` + `translateY(12px) → 0` at 60ms intervals.

### Skills JSON

Triggered by `cat skills.json`. Renders a syntax-highlighted, animated JSON tree:

```json
{
  "languages":  ["TypeScript", "Python", "Rust", "Go"],
  "frontend":   ["React", "Next.js / vinext", "Svelte"],
  "backend":    ["Bun", "Hono", "Node.js", "PostgreSQL"],
  "tools":      ["Docker", "Git", "Neovim"],
  "learning":   ["WebGL", "Zig", "Distributed systems"]
}
```

Syntax coloring: keys in neon magenta, strings in lavender-white, brackets in muted. Each line types in with 30ms stagger.

### Contact Panel

Triggered by `./contact`. Spawns a minimal form as a "process" in the terminal:

```
> Launching contact.sh...

┌──────────────────────────────────────┐
│  name:    [                        ] │
│  email:   [                        ] │
│  message: [                        ] │
│                                      │
│  [send message]                      │
└──────────────────────────────────────┘
```

Form submits via a server action (vinext). On success: animated `> Message sent. [OK]` confirmation in the terminal.

---

## Motion Principles

1. **Entry**: All content enters via typewriter or staggered line-by-line reveal — never instant
2. **Exit**: Quick `opacity → 0` + `translateY(-8px)` over 150ms
3. **Spring physics**: Framer Motion `spring` everywhere — `stiffness: 120, damping: 14`
4. **Ambient**: Cursor blinks at 1s interval; particles drift at ~20px/s; scanlines pulse at 0.3Hz
5. **Respect `prefers-reduced-motion`**: All animations reduce to simple opacity fades

---

## Content Sections

- `about` — bio, what I'm working on, personal note
- `projects` — 4–8 projects with descriptions, tech, links
- `skills` — grouped by domain, includes "currently learning"
- `contact` — name, email, message form via server action

---

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | vinext | Next.js API on Vite — faster builds, Cloudflare Workers deploy |
| Runtime | Bun | Fast installs, built-in test runner, native TS |
| Styling | Tailwind v4 | Zero-config, JIT, CSS variables for theming |
| Animation | Framer Motion + GSAP | Framer for component transitions, GSAP ScrollTrigger for timeline sequences |
| Particles | `@tsparticles/react` | Lightweight, configurable, purple palette |
| Forms | vinext Server Actions | No external form service needed |
| Fonts | JetBrains Mono + Space Grotesk | Via `next/font` (vinext-compatible) |
| Deploy | Cloudflare Workers via `vinext deploy` | Zero cold starts, global edge |

---

## Non-Goals

- No blog (Core 4 only)
- No playground section
- No CMS / external data source
- No authentication
- No analytics (can add later)
