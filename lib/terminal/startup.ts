import { ABOUT } from "@/lib/content/about";
import { buildHelpText } from "./commands";

export interface TranscriptLine {
  text: string;
  colorClass?: string;
}

export function buildStartupTranscript(): { lines: TranscriptLine[] } {
  const helpLines = buildHelpText().split("\n");

  const logo = [
    "      _ __         __",
    "     / / /__ _____/ /_",
    "    / / / _ `/ __/ __/",
    "   /_/_/\\_,_/_/  \\__/ ",
  ];

  const info: Array<[string, string]> = [
    ["User", ABOUT.name],
    ["Tagline", ABOUT.tagline],
    ["OS", "Portfolio OS"],
    ["Shell", "portfolio-bash 1.0"],
    ["Runtime", "Bun"],
    ["GitHub", "github.com/Nefnief-tech"],
    ["Repos", "50 public"],
    ["Member since", "2022"],
  ];

  const logoWidth = Math.max(...logo.map((l) => l.length));
  const infoLines = info.map(([k, v]) => `${k}: ${v}`);

  const neofetchLines = Array.from(
    { length: Math.max(logo.length, infoLines.length) },
    (_, i) => {
      const left = (logo[i] ?? "").padEnd(logoWidth, " ");
      const right = infoLines[i] ?? "";
      return right ? `${left}  ${right}` : left;
    },
  );

  const lines: TranscriptLine[] = [
    {
      text: "█ PORTFOLIO OS v1.0.0 — booting...",
      colorClass: "term-green-glow",
    },
    { text: "  > loading modules ........ [OK]", colorClass: "term-green" },
    {
      text: "  > mounting /home/nefnief/ ..... [OK]",
      colorClass: "term-green",
    },
    {
      text: "  > starting shell ............... [OK]",
      colorClass: "term-green",
    },
    { text: "" },
    ...neofetchLines.map((text, i) => ({
      text,
      colorClass: i < logo.length ? "term-cyan" : "term-cyan",
    })),
    { text: "" },
    {
      text: "┌─────────────────────────────────────────┐",
      colorClass: "term-pink",
    },
    {
      text: `${`│  Hi. I'm ${ABOUT.name}.`.padEnd(42, " ")}│`,
      colorClass: "term-pink",
    },
    {
      text: `${`│  ${ABOUT.tagline}`.padEnd(42, " ")}│`,
      colorClass: "term-yellow",
    },
    {
      text: "│  Type 'help' to see what I've made.     │",
      colorClass: "term-pink",
    },
    {
      text: "└─────────────────────────────────────────┘",
      colorClass: "term-pink",
    },
    { text: "" },
    ...helpLines.map((text, i) => ({
      text,
      colorClass: i === 0 ? "term-yellow-glow" : "term-cyan",
    })),
  ];

  return { lines };
}
