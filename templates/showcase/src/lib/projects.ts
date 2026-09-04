export interface Project {
  id: string;
  title: string;
  summary: string;
  year: number;
  tags: string[];
  link: string;
}

export const PROJECTS: Project[] = [
  {
    id: "tide",
    link: "https://ilha.build",
    summary: "A realtime dashboard for coastal sensors, built with server islands.",
    tags: ["ilha", "product"],
    title: "Tide",
    year: 2026,
  },
  {
    id: "atlas-ui",
    link: "https://ilha.build",
    summary: "A component library shipped as custom elements, usable from any stack.",
    tags: ["open source", "design systems"],
    title: "Atlas UI",
    year: 2025,
  },
  {
    id: "field-notes",
    link: "https://ilha.build",
    summary: "A writing site with a hand-rolled Markdown pipeline and zero client JavaScript.",
    tags: ["writing", "ilha"],
    title: "Field Notes",
    year: 2025,
  },
  {
    id: "harbor",
    link: "https://ilha.build",
    summary: "Deploy previews for static sites, from a single CLI command.",
    tags: ["product", "tooling"],
    title: "Harbor",
    year: 2024,
  },
];

export const ALL_TAGS = [...new Set(PROJECTS.flatMap((project) => project.tags))].sort();
