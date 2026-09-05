# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `minimal` template.

The smallest useful Ilha app: one island mounted into `#app` with Vite as the dev server and bundler. No router, no CSS framework.

## Getting started

```bash
{{packageManager}} install
{{packageManager}} run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command                        | Description                       |
| ------------------------------ | --------------------------------- |
| `{{packageManager}} run dev`       | Start the Vite dev server         |
| `{{packageManager}} run build`     | Build for production              |
| `{{packageManager}} run preview`   | Preview the production build      |
| `{{packageManager}} run typecheck` | Type-check without emitting files |

## Project layout

```text
src/
  app.tsx      # The island
  main.ts      # Client entry — mount(root, App)
  style.css    # Plain CSS
```

## Where to next

- [Core concepts](https://ilha.build/guide/getting-started/core-concepts/)
- [State management](https://ilha.build/guide/ui/state/)
- [Add a router](https://ilha.build/guide/routing/overview/)
