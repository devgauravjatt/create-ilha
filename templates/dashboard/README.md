# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `dashboard` template.

An admin dashboard shell: sidebar layout, stat cards driven by derived atoms, a filterable project table, a dynamic route and an error boundary.

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
  lib/data.ts            # Demo data — swap for your API
  pages/
    +layout.tsx          # Sidebar shell
    +error.tsx           # Error boundary for every route below it
    index.tsx            # Stats and activity
    projects/index.tsx   # Search + filter table
    projects/[id].tsx    # Dynamic route, throws error(404) when missing
    settings.tsx         # Form state with atom() and batch()
    [...slug].tsx        # 404
```

## What to look at

- `projects/[id].tsx` reads params with `useRoute()` and throws with `error(404, …)`.
- `+error.tsx` catches those throws — see [error boundaries](https://ilha.build/guide/routing/error-boundaries/).
- `index.tsx` derives its stats with `Atom.map` instead of effects.
- Ready for real data? Keep queries on the server with
  [server islands](https://ilha.build/guide/routing/server-islands/).
