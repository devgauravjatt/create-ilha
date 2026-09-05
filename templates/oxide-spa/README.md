# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `oxide-spa` template.

A minimal Ilha app with [Oxide](https://oxide.build). Pages live in `src/pages/` and mount via `@ilha/router`. Learn renders on the server, and the todo list is a server island.

## Requirements

- [Bun](https://bun.sh) or Node.js 20+

## Getting started

```bash
{{packageManager}} install
{{packageManager}} run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `{{packageManager}} run dev`     | Start the Vite development server   |
| `{{packageManager}} run build`   | Build the server and client bundles |
| `{{packageManager}} run preview` | Preview the production build        |
| `{{packageManager}} run start`   | Run the production server           |
| `{{packageManager}} run typecheck` | Type-check without emitting files |

## Project layout

```text
src/
  pages/       # File-based routes (+layout, index, learn.server, …)
  lib/         # Server islands and actions
  client.ts    # Client entry — mounts islands
  server.ts    # Oxide server entry
  app.css      # Tailwind + daisyUI
```

On a cold `dev` start the very first frame request can beat the island registry and come
back empty — reload once and it renders. Production builds are unaffected.

The UI matches the Vite template, but `<TaskList />` keeps its data and mutations on the server. `learn.server.tsx` is a server page.
