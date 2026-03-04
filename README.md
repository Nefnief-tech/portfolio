# Nefnief's Terminal Portfolio

A terminal-style portfolio website with a dark purple aesthetic, animated boot sequence, and real GitHub data.

![Terminal](https://img.shields.io/badge/terminal-portfolio-9b30ff?style=for-the-badge)
![Bun](https://img.shields.io/badge/runtime-bun-f9f1e1?style=for-the-badge&logo=bun)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript)

## Features

- **Animated Boot Sequence** — non-skippable startup with neofetch-style system info, colorized terminal output, and CRT scanline overlay
- **Interactive Terminal** — type commands like a real shell with ANSI-style colors, blinking block cursor, and fuzzy command suggestions
- **GUI Mode** — type `gui` to switch to a scroll-friendly view with staggered reveal animations and color-coded sections
- **Real Data** — projects, skills, and profile info pulled from GitHub
- **Dark Purple Theme** — custom color palette with kinetic glow effects and phosphor text shadows

## Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `about` | Who I am |
| `projects` | Things I've built |
| `skills` | Tech stack |
| `contact` | Get in touch |
| `gui` | Switch to GUI mode |
| `clear` | Clear terminal |

## Tech Stack

- **Runtime** — [Bun](https://bun.sh)
- **Framework** — [Vinext.js](https://github.com/nicely-gg/vinext) (Next.js-compatible)
- **Language** — TypeScript (strict)
- **Styling** — Tailwind CSS v4
- **Animation** — Framer Motion
- **Linting** — Biome

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build

# Type check
bunx tsc --noEmit

# Lint
bun run lint
```

## Project Structure

```
app/
  page.tsx                 # Boot → Terminal → GUI state machine
  globals.css              # Terminal colors, CRT effects, glow utilities
components/
  terminal/
    BootSequence.tsx        # Animated startup with neofetch
    TerminalWindow.tsx      # Main terminal shell
    InputLine.tsx           # Prompt with blinking cursor
    HistoryLog.tsx          # Command history renderer
  GUIView.tsx              # Scroll-friendly GUI mode
  sections/                # About, Projects, Skills, Contact panels
lib/
  terminal/
    commands.ts             # Command registry
    useTerminal.ts          # Terminal state reducer
    startup.ts              # Boot transcript generator
  content/
    about.ts                # Profile data
    projects.ts             # Project entries
    skills.ts               # Tech stack categories
```

## License

MIT
