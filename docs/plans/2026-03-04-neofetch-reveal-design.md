# Neofetch-like Dual-Column Reveal Design

## Goal
Provide a proven UI pattern for a neofetch-like boot/profile animation in a web terminal UI with a dark purple, kinetic aesthetic.

## 1. Visual & Layout Architecture
The component, `FetchProfile`, uses a responsive dual-column layout:
- **Left Column (`FetchLogo`)**: Monospace ASCII art or SVG paths in `#A855F7` (purple) with a subtle `glow-primary` effect.
- **Right Column (`FetchDetails`)**: A list of `DetailItem` pairs (Label: Value). Labels use `text-primary` and bold styling; values use `text-text-soft`.
- **Bottom Section**: A row of 8-16 kinetic "ANSI Color Blocks" to anchor the design.

## 2. Motion & Kinetic Polish (Framer Motion)
- **Logo Wipe**: 600ms vertical clip-path wipe reveal (simulating CRT scanlines).
- **Staggered Details**: Each info line slides in from `x: 20` to `0` with a 40ms stagger.
- **Physics**: High-damping spring (stiffness: 100, damping: 20) for "snappy" landing.
- **Color Blocks**: Scale-up (0 to 1) with an elastic bounce once text reveal is 80% complete.

## 3. Accessibility & UX
- **ARIA**: Logo wrapped in `aria-hidden="true"`.
- **Screen Reader**: Hidden `<span class="sr-only">System Information Summary</span>` provided.
- **Reduced Motion**: Skip all transitions if `prefers-reduced-motion` is active.
- **Interaction**: "Any key" or "Click" to skip the animation.

## 4. Key Do's & Don'ts
- ✅ Use high-contrast purples on black backgrounds.
- ✅ Keep total animation duration under 1.5 seconds.
- ❌ Don't trap users in the animation loop.
- ❌ Don't rely on standard HTML space collapsing for ASCII art.
