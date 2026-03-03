// components/sections/ProjectCard.tsx
"use client";
import { motion } from "framer-motion";
import type { Project } from "@/lib/content/projects";

interface Props {
  project:  Project;
  onExpand: (id: string) => void;
  delay:    number;
}

export function ProjectCard({ project, onExpand, delay }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2, type: "spring", stiffness: 120, damping: 14 }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 16px #9B30FF55" }}
      onClick={() => onExpand(project.id)}
      className="border border-border rounded-md p-4 cursor-pointer bg-surface/60 hover:border-primary transition-colors"
    >
      <div className="text-primary glow-primary font-bold mb-1">{project.name}</div>
      <div className="text-text-soft text-xs mb-3">{project.description}</div>
      <div className="flex flex-wrap gap-1">
        {project.tags.map(tag => (
          <span key={tag} className="text-muted text-xs font-mono">[{tag}]</span>
        ))}
      </div>
      <div className="flex gap-3 mt-3">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            className="text-muted text-xs hover:text-primary"
            onClick={e => e.stopPropagation()}
          >github ↗</a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="text-muted text-xs hover:text-accent"
            onClick={e => e.stopPropagation()}
          >live ↗</a>
        )}
      </div>
    </motion.div>
  );
}
