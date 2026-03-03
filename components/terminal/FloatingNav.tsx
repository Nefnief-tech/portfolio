import type { Section } from "@/lib/terminal/types";

interface Props {
  active: Section | null;
  onSelect: (s: Section) => void;
}

export function FloatingNav({ active, onSelect }: Props) {
  return null;
}
