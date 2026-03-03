// components/sections/ProjectsGrid.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "@/lib/content/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const project = PROJECTS.find(p => p.id === expanded);

  return (
    <div className="px-6 py-3 font-mono text-sm">
      <motion.div
        className="text-muted mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {`> ls ~/projects`}
      </motion.div>

      <AnimatePresence mode="wait">
        {expanded && project ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-0.5"
          >
            <button
              className="text-muted hover:text-primary mb-3 text-xs"
              onClick={() => setExpanded(null)}
            >
              ← back to projects
            </button>
            {project.detail.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={line.startsWith("##") ? "text-accent font-bold text-base" : "text-text-soft"}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} project={p} onExpand={setExpanded} delay={i * 0.07} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
