/**
 * The template registry. Each entry maps to a directory in `templates/`.
 */

export interface Template {
  /** Directory name under `templates/`, and the value of `--template`. */
  id: string;
  /** Shown in the interactive picker. */
  label: string;
  /** Short suffix shown next to the label. */
  hint: string;
  /** Longer description, used by `--list`. */
  description: string;
  /** Extra names accepted by `--template`. */
  aliases?: string[];
}

export const TEMPLATES: Template[] = [
  {
    aliases: ["blank", "basic"],
    description:
      "Vite + Ilha with a single island and no router. The smallest possible starting point.",
    hint: "Vite · no router",
    id: "minimal",
    label: "Minimal",
  },
  {
    aliases: ["spa", "vite"],
    description:
      "Client-side SPA with file-system routes, layouts, Tailwind CSS and daisyUI. Ships as static files.",
    hint: "Vite · file routes",
    id: "vite-spa",
    label: "SPA",
  },
  {
    aliases: ["ssr", "oxide", "server-islands"],
    description:
      "Oxide server with server pages and server islands: data and mutations stay on the server.",
    hint: "Oxide · server islands",
    id: "oxide-spa",
    label: "SSR + server islands",
  },
  {
    aliases: ["marketing"],
    description: "Marketing landing page with hero, feature grid, pricing and a waitlist form.",
    hint: "Vite · marketing",
    id: "landing",
    label: "Landing page",
  },
  {
    aliases: ["admin"],
    description:
      "Admin dashboard with a sidebar layout, live metrics driven by streams and dynamic routes.",
    hint: "Vite · app shell",
    id: "dashboard",
    label: "Dashboard",
  },
  {
    aliases: ["oxide-blog"],
    description:
      "Content site rendered on the server: server pages for posts, a server island for reactions.",
    hint: "Oxide · server pages",
    id: "blog",
    label: "Blog",
  },
  {
    aliases: ["portfolio"],
    description: "Personal site with project showcase, about page and a contact form.",
    hint: "Vite · personal site",
    id: "showcase",
    label: "Showcase / portfolio",
  },
  {
    aliases: ["library", "ui"],
    description:
      "Publishable component library: Ilha components, custom elements via `ilha/define`, Vite library build.",
    hint: "Vite · library mode",
    id: "component-library",
    label: "Component library",
  },
  {
    aliases: ["astro-islands"],
    description: "Astro site that renders and hydrates Ilha islands with `@ilha/astro`.",
    hint: "Astro · islands",
    id: "astro",
    label: "Astro",
  },
];

export const DEFAULT_TEMPLATE = "vite-spa";

export const findTemplate = (name: string): Template | undefined => {
  const needle = name.trim().toLowerCase();
  return TEMPLATES.find((template) => template.id === needle || template.aliases?.includes(needle));
};

export const templateNames = () => TEMPLATES.map((template) => template.id);
