// lib/content/projects.ts
export interface Project {
  id:          string;
  name:        string;
  description: string;
  tags:        string[];
  githubUrl?:  string;
  liveUrl?:    string;
  detail:      string[];
}

export const PROJECTS: Project[] = [
  {
    id: "project-one",
    name: "project-one",
    description: "A short description of what this does",
    tags: ["TypeScript", "Bun", "Hono"],
    githubUrl: "https://github.com/you/project-one",
    detail: [
      "## project-one",
      "",
      "Full description. Why you built it, what you learned.",
      "",
      "Built with TypeScript, Bun, and Hono. Deployed on Cloudflare Workers.",
    ],
  },
];
