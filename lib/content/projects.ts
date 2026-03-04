// lib/content/projects.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  detail: string[];
}

export const PROJECTS: Project[] = [
  {
    id: "grades-tracker",
    name: "grades-tracker",
    description:
      "E2E-encrypted grade management app with cloud sync and analytics",
    tags: ["TypeScript", "Next.js 15", "React 19", "Appwrite", "Docker"],
    githubUrl: "https://github.com/Nefnief-tech/grades-tracker",
    detail: [
      "## grades-tracker",
      "",
      "A full-featured grade management app built with Next.js 15 and React 19.",
      "All data is end-to-end encrypted before hitting the Appwrite backend,",
      "so only you can read your grades. Supports cloud sync across devices,",
      "analytics dashboards, and is fully self-hostable via Docker.",
      "",
      "Stack: TypeScript · Next.js 15 · React 19 · Appwrite · Docker",
    ],
  },
  {
    id: "klipper-mobile-app",
    name: "klipper-mobile-app",
    description: "Flutter mobile app for Klipper 3D printer farm management",
    tags: ["Flutter", "Dart", "Klipper", "Moonraker", "Spoolman"],
    githubUrl: "https://github.com/Nefnief-tech/klipper-mobile-app",
    detail: [
      "## klipper-mobile-app  (Farm Manager)",
      "",
      "A Flutter mobile app for managing Klipper-based 3D printer farms.",
      "Connects to Moonraker APIs for real-time print monitoring, integrates",
      "with Box Turtle AFC for multi-material workflows, and syncs filament",
      "inventory through Spoolman. Ships with 3 selectable themes.",
      "",
      "Stack: Flutter · Dart · Klipper · Moonraker · Spoolman",
    ],
  },
  {
    id: "sub-api",
    name: "sub-api",
    description:
      "Automated substitute plan scraper with Discord & Gotify push notifications",
    tags: ["Python", "FastAPI", "APScheduler", "Discord", "Gotify"],
    githubUrl: "https://github.com/Nefnief-tech/sub-api",
    detail: [
      "## sub-api  (Vertretungsplan Scraper)",
      "",
      "A FastAPI service that scrapes school substitute plans on a cron schedule",
      "and fans out notifications via Discord webhooks and Gotify push.",
      "Includes a dark-themed web UI for browsing past and upcoming changes.",
      "",
      "Stack: Python · FastAPI · APScheduler · Discord webhooks · Gotify",
    ],
  },
  {
    id: "lume-algo-sesh",
    name: "lume-algo-sesh",
    description:
      "High-performance Rust matching service with sub-100ms latency",
    tags: ["Rust", "Redis", "Matching", "High-performance"],
    githubUrl: "https://github.com/Nefnief-tech/lume-algo-sesh",
    detail: [
      "## lume-algo-sesh  (Lume Matching Engine)",
      "",
      "The algorithmic core of Lume — a dating-app matching service written in Rust.",
      "Uses a multi-stage filter pipeline to narrow candidates, then scores and ranks",
      "with Redis caching at each stage. Achieves sub-100ms p99 response times",
      "under realistic load.",
      "",
      "Stack: Rust · Redis · Multi-stage pipeline",
    ],
  },
  {
    id: "3d-fast-recon",
    name: "3d-fast-recon",
    description:
      "Containerised Fast3R 3D reconstruction model with NVIDIA GPU acceleration",
    tags: ["Python", "Docker", "CUDA", "PyTorch", "3D Reconstruction"],
    githubUrl: "https://github.com/Nefnief-tech/3d-fast-recon",
    detail: [
      "## 3d-fast-recon",
      "",
      "A Dockerised deployment of the Fast3R 3D reconstruction model.",
      "Configured for NVIDIA GPU acceleration via CUDA, runnable with",
      "both Docker and Podman. Feed it a set of images; get a 3D point",
      "cloud out.",
      "",
      "Stack: Python · Docker/Podman · PyTorch · CUDA · NVIDIA GPU",
    ],
  },
  {
    id: "fitness-app",
    name: "fitness-app",
    description: "AI-powered fitness assistant using Google Gemini API",
    tags: ["TypeScript", "Gemini API", "AI", "Google AI Studio"],
    githubUrl: "https://github.com/Nefnief-tech/fitness-app",
    detail: [
      "## fitness-app",
      "",
      "An AI fitness assistant powered by the Google Gemini API.",
      "Built during exploration of Google AI Studio — generates personalised",
      "workout plans and tracks progress.",
      "",
      "Stack: TypeScript · Google AI Studio · Gemini API",
    ],
  },
];
