# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `astro` template.

An [Astro](https://astro.build) site that renders and hydrates Ilha components as Astro islands through [`@ilha/astro`](https://ilha.build/guide/astro/).

## Getting started

```bash
{{packageManager}} install
{{packageManager}} run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Scripts

| Command                            | Description                        |
| ---------------------------------- | ---------------------------------- |
| `{{packageManager}} run dev`       | Start the Astro dev server         |
| `{{packageManager}} run build`     | Build the static site to `dist/`   |
| `{{packageManager}} run preview`   | Preview the production build       |
| `{{packageManager}} run typecheck` | Run `astro check`                  |

## Project layout

```text
src/
  islands/          # Ilha components — hydrated with client directives
  layouts/          # Astro layouts
  pages/            # Astro routes
  styles/global.css
astro.config.mjs    # Registers the ilha() integration
```

## Client directives

| Directive                    | Behavior                                   |
| ---------------------------- | ------------------------------------------ |
| `client:load`                | Hydrate as soon as the page loads          |
| `client:idle`                | Hydrate when the browser is idle           |
| `client:visible`             | Hydrate when the island enters the viewport |
| `client:media`               | Hydrate when a media query matches         |
| `client:only="@ilha/astro"`  | Skip SSR, mount fresh in the browser       |

An island with no directive stays static HTML.

## Notes

- Ilha components do not support Astro `<slot />` forwarding — pass data through props.
- Mixing JSX frameworks? Give the integration `include` globs: `ilha({ include: ["**/islands/**"] })`.
