# Neofetch-like Dual-Column Reveal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a neofetch-like boot/profile animation in a web terminal UI with kinetic motion and a dark purple aesthetic.

**Architecture:** Use a `FetchProfile` component that splits into a `FetchLogo` (left) and `FetchDetails` (right). The logo reveals via a vertical wipe, while info lines stagger in from the right. A bottom row of "color blocks" scales up as the final flourish.

**Tech Stack:** React, Next.js, Framer Motion, Tailwind CSS.

---

### Task 1: Create the FetchLogo Component

**Files:**
- Create: `components/terminal/FetchLogo.tsx`

**Step 1: Write minimal implementation with Framer Motion vertical wipe reveal**

```tsx
"use client";
import { motion } from "framer-motion";

const ASCII_LOGO = `
 ██████╗ ██████╗ ██████╗ ██████╗ 
 ██╔══██╗██╔══██╗██╔══██╗██╔══██╗
 ██████╔╝██████╔╝██████╔╝██████╔╝
 ██╔═══╝ ██╔══██╗██╔═══╝ ██╔══██╗
 ██║     ██║  ██║██║     ██║  ██║
 ╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝
`;

export function FetchLogo() {
  return (
    <div className="relative font-mono text-xs leading-none text-primary glow-primary select-none" aria-hidden="true">
      <motion.pre
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {ASCII_LOGO}
      </motion.pre>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/terminal/FetchLogo.tsx
git commit -m "feat: add FetchLogo with vertical wipe animation"
```

---

### Task 2: Create the DetailItem Component

**Files:**
- Create: `components/terminal/DetailItem.tsx`

**Step 1: Write minimal implementation with staggered slide-in animation**

```tsx
"use client";
import { motion } from "framer-motion";

interface Props {
  label: string;
  value: string;
  index: number;
}

export function DetailItem({ label, value, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.05 + 0.5, 
        duration: 0.3, 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }}
      className="flex gap-2 font-mono text-sm"
    >
      <span className="text-primary font-bold">{label}:</span>
      <span className="text-text-soft">{value}</span>
    </motion.div>
  );
}
```

**Step 2: Commit**

```bash
git add components/terminal/DetailItem.tsx
git commit -m "feat: add DetailItem with staggered slide-in animation"
```

---

### Task 3: Create the ColorBlocks Component

**Files:**
- Create: `components/terminal/ColorBlocks.tsx`

**Step 1: Write implementation for the bottom ANSI color anchors**

```tsx
"use client";
import { motion } from "framer-motion";

const COLORS = [
  "bg-black", "bg-red-500", "bg-green-500", "bg-yellow-500",
  "bg-blue-500", "bg-purple-500", "bg-cyan-500", "bg-white"
];

export function ColorBlocks() {
  return (
    <div className="flex gap-1 mt-4">
      {COLORS.map((color, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 1.2 + i * 0.05, 
            type: "spring", 
            stiffness: 200, 
            damping: 15 
          }}
          className={`h-4 w-4 sm:h-5 sm:w-5 ${color} border border-white/10`}
        />
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/terminal/ColorBlocks.tsx
git commit -m "feat: add kinetic ColorBlocks flourish"
```

---

### Task 4: Assemble the FetchProfile Component

**Files:**
- Create: `components/terminal/FetchProfile.tsx`

**Step 1: Combine logo, details, and blocks into a responsive layout**

```tsx
"use client";
import { FetchLogo } from "./FetchLogo";
import { DetailItem } from "./DetailItem";
import { ColorBlocks } from "./ColorBlocks";

const PROFILE_DATA = [
  { label: "OS", value: "Portfolio OS v1.0.0" },
  { label: "Host", value: "portfolio.dev" },
  { label: "Kernel", value: "Next.js 15.1" },
  { label: "Shell", value: "React/TS" },
  { label: "Theme", value: "Neon Purple" },
];

export function FetchProfile() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-2xl mx-auto items-center md:items-start bg-black/40 backdrop-blur-sm rounded-lg border border-primary/20">
      <span className="sr-only">System Information Summary for [Your Name]</span>
      
      <FetchLogo />
      
      <div className="flex flex-col">
        <div className="space-y-1">
          {PROFILE_DATA.map((item, i) => (
            <DetailItem key={item.label} {...item} index={i} />
          ))}
        </div>
        <ColorBlocks />
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/terminal/FetchProfile.tsx
git commit -m "feat: assemble FetchProfile with all sub-components"
```

---

### Task 5: Integration and Accessibility Check

**Files:**
- Modify: `components/terminal/BootSequence.tsx` (to trigger FetchProfile)

**Step 1: Update BootSequence or main page to include the new FetchProfile after boot**

*(Optional step depending on current project flow, can be tested by replacing the boot text with <FetchProfile />)*

**Step 2: Final accessibility audit**
- Verify `aria-hidden` on ASCII logo.
- Verify `sr-only` span exists.
- Ensure `prefers-reduced-motion` is respected (wrap motion components with a hook if needed).

**Step 3: Final Commit**

```bash
git commit -m "chore: final integration and accessibility audit for FetchProfile"
```
