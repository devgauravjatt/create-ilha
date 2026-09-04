# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `landing` template.

A marketing landing page: hero, logo strip, feature grid, pricing table and a waitlist form. Client-side only, so it deploys anywhere static files are served.

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
  pages/
    +layout.tsx   # Navbar, footer, <head> defaults
    index.tsx     # Hero, features, waitlist island
    pricing.tsx   # Plans with a monthly/yearly toggle
    [...slug].tsx # 404
  main.ts         # Client entry
  app.css         # Tailwind CSS + daisyUI
```

## Make it yours

- Swap the copy in `FEATURES`, `LOGOS` and `PLANS`.
- Point the waitlist form at your own endpoint — see [async mutations](https://ilha.build/guide/ui/state/#async-mutations).
- Pick another daisyUI theme in `src/app.css`.
- Need server-rendered content or a database? Start from the `oxide-spa` template or read
  [server islands](https://ilha.build/guide/routing/server-islands/).
