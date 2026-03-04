"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ContactPanel } from "@/components/sections/ContactPanel";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ABOUT } from "@/lib/content/about";
import { PROJECTS } from "@/lib/content/projects";
import { SKILLS } from "@/lib/content/skills";

interface Props {
  onSwitchToTerminal: () => void;
}

const SECTION_DELAY = 0.3;

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * SECTION_DELAY,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function NavBar({ onSwitchToTerminal }: { onSwitchToTerminal: () => void }) {
  const links = [
    { label: "About", href: "#about", color: "term-cyan hover:term-cyan-glow" },
    {
      label: "Projects",
      href: "#projects",
      color: "term-green hover:term-green-glow",
    },
    {
      label: "Skills",
      href: "#skills",
      color: "term-pink hover:term-pink-glow",
    },
    {
      label: "Contact",
      href: "#contact",
      color: "term-yellow hover:term-yellow-glow",
    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-border bg-surface/90 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={onSwitchToTerminal}
        className="term-green hover:term-green-glow text-sm font-mono transition-colors"
      >
        ← Terminal
      </button>
      <div className="flex gap-6">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`${l.color} text-sm font-mono transition-colors`}
          >
            {l.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

function AboutSection() {
  return (
    <motion.section
      id="about"
      custom={0}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="px-6 py-12 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-accent glow-accent mb-2 font-mono">
        {ABOUT.name}
      </h1>
      <p className="text-primary glow-primary text-lg font-mono mb-6">
        {ABOUT.tagline}
      </p>
      <div className="space-y-1 font-mono text-sm text-text-soft">
        {ABOUT.bio.map((line, i) => (
          <p key={`bio-${i.toString()}`}>{line || "\u00A0"}</p>
        ))}
      </div>
      <div className="mt-6 flex gap-4">
        {ABOUT.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline glow-primary hover:text-accent text-sm font-mono transition-colors"
          >
            [{link.label}] ↗
          </a>
        ))}
      </div>
    </motion.section>
  );
}

function ProjectsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const project = PROJECTS.find((p) => p.id === expanded);

  return (
    <motion.section
      id="projects"
      custom={1}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="px-6 py-12 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-accent glow-accent mb-6 font-mono">
        Projects
      </h2>
      {expanded && project ? (
        <div className="space-y-1 font-mono text-sm">
          <button
            type="button"
            className="text-muted hover:text-primary mb-3 text-xs"
            onClick={() => setExpanded(null)}
          >
            ← back
          </button>
          {project.detail.map((line, i) => (
            <p
              key={`detail-${i.toString()}`}
              className={
                line.startsWith("##")
                  ? "text-accent font-bold text-base"
                  : "text-text-soft"
              }
            >
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              onExpand={setExpanded}
              delay={i * 0.1}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  languages: "border-[var(--term-cyan)] text-[var(--term-cyan)]",
  frontend: "border-[var(--term-pink)] text-[var(--term-pink)]",
  backend: "border-[var(--term-green)] text-[var(--term-green)]",
  tools: "border-[var(--term-orange)] text-[var(--term-orange)]",
  ai_ml: "border-[var(--term-yellow)] text-[var(--term-yellow)]",
};

function SkillsSection() {
  return (
    <motion.section
      id="skills"
      custom={2}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="px-6 py-12 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-accent glow-accent mb-6 font-mono">
        Skills
      </h2>
      <div className="space-y-4">
        {Object.entries(SKILLS).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-primary glow-primary text-sm font-mono font-bold mb-2 uppercase tracking-wider">
              {category.replace("_", " ")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill}
                  className={`px-3 py-1 text-xs font-mono border rounded-md bg-surface/60 hover:bg-surface transition-colors ${CATEGORY_COLORS[category] ?? "border-border text-text-soft"}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function ContactSection() {
  return (
    <motion.section
      id="contact"
      custom={3}
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="px-6 py-12 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-accent glow-accent mb-6 font-mono">
        Contact
      </h2>
      <ContactPanel />
    </motion.section>
  );
}

export function GUIView({ onSwitchToTerminal }: Props) {
  return (
    <div className="h-full overflow-y-auto">
      <NavBar onSwitchToTerminal={onSwitchToTerminal} />
      <AboutSection />
      <div className="border-t border-border" />
      <ProjectsSection />
      <div className="border-t border-border" />
      <SkillsSection />
      <div className="border-t border-border" />
      <ContactSection />
      <footer className="py-8 text-center text-muted text-xs font-mono">
        Type &apos;gui&apos; in terminal to come back here · Built with Bun +
        vinext.js
      </footer>
    </div>
  );
}
