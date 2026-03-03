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
