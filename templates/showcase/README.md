# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `showcase` template.

A personal site: filterable project grid, an about page and a validated contact form. Client-side only, so it deploys to any static host.

## Getting started

```bash
{{packageManager}} install
{{packageManager}} run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command                            | Description                       |
| ---------------------------------- | --------------------------------- |
| `{{packageManager}} run dev`       | Start the Vite dev server         |
| `{{packageManager}} run build`     | Build for production              |
| `{{packageManager}} run preview`   | Preview the production build      |
| `{{packageManager}} run typecheck` | Type-check without emitting files |

## Project layout

```text
src/
  lib/projects.ts   # Your work — edit this first
  pages/
    +layout.tsx     # Header, footer, <head> defaults
    index.tsx       # Filterable project grid
    about.tsx
    contact.tsx     # Form validation with atoms
    [...slug].tsx   # 404
  main.ts
  app.css           # Tailwind CSS + daisyUI
```

## When it is live

Send it in for the official [Ilha showcase](https://ilha.build/guide/resources/showcase/).
