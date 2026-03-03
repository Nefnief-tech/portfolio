import type { Section } from "./types";

export interface CommandDef {
  description: string;
  action: "section" | "clear" | "help" | "easter";
  target?: Section;
  easterText?: string;
}

export const COMMANDS: Record<string, CommandDef> = {
  help:              { description: "List all commands",      action: "help" },
  "?":               { description: "Alias for help",         action: "help" },
  about:             { description: "Display about section",  action: "section", target: "about" },
  whoami:            { description: "Alias for about",        action: "section", target: "about" },
  projects:          { description: "List projects",          action: "section", target: "projects" },
  "ls projects":     { description: "Alias for projects",     action: "section", target: "projects" },
  skills:            { description: "Show skills.json",       action: "section", target: "skills" },
  "cat skills.json": { description: "Alias for skills",       action: "section", target: "skills" },
  contact:           { description: "Open contact form",      action: "section", target: "contact" },
  "./contact":       { description: "Alias for contact",      action: "section", target: "contact" },
  clear:             { description: "Clear terminal",         action: "clear" },
  cls:               { description: "Alias for clear",        action: "clear" },
  exit:              { description: "...",                     action: "easter", easterText: "Nice try. You can't leave." },
  sudo:              { description: "...",                     action: "easter", easterText: "sudo: you are not worthy." },
};

export function closestCommand(input: string): string | null {
  const keys = Object.keys(COMMANDS);
  let best = Infinity;
  let match: string | null = null;
  for (const k of keys) {
    const d = levenshtein(input.toLowerCase(), k);
    if (d < best && d <= 3) {
      best = d;
      match = k;
    }
  }
  return match;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}
