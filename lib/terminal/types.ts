export type Section = "about" | "projects" | "skills" | "contact";

export type HistoryEntry =
  | { kind: "input"; text: string }
  | { kind: "output"; text: string; isError?: boolean; colorClass?: string }
  | { kind: "section"; section: Section };

export interface TerminalState {
  history: HistoryEntry[];
  currentCommand: string;
  activeSection: Section | null;
  isAnimating: boolean;
  guiRequested: boolean;
}
