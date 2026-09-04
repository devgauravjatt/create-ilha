# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `component-library` template.

A publishable component library. Components are plain Ilha components, exported from `src/index.ts`, with an optional custom-element entry so plain HTML can use them too.

## Getting started

```bash
{{packageManager}} install
{{packageManager}} run dev
```

The dev server opens the playground in `playground/` — a real page that imports the components straight from `src/`.

## Scripts

| Command                            | Description                                    |
| ---------------------------------- | ---------------------------------------------- |
| `{{packageManager}} run dev`       | Playground dev server                          |
| `{{packageManager}} run build`     | Bundle to `dist/` and emit declaration files   |
| `{{packageManager}} run preview`   | Preview the built playground                   |
| `{{packageManager}} run typecheck` | Type-check without emitting files              |

## Project layout

```text
src/
  components/     # Button, Card, Counter
  index.ts        # Public entry — what consumers import
  elements.ts     # Optional: register custom elements with define()
  styles.css      # One stylesheet, shipped alongside the bundle
playground/       # Local demo page (not published)
```

## Publishing

1. Set a real `name`, `version` and `description` in `package.json`.
2. Remove `"private": true`.
3. `{{packageManager}} run build`, then `npm publish`.

`ilha` and `effect` stay peer dependencies so applications keep a single copy.

## Consuming it

```tsx
import { Button, Counter } from "{{projectName}}";
import "{{projectName}}/styles.css";

export const Demo = () => (
  <Button onclick={() => console.log("clicked")}>Click me</Button>
);
```

Or without a build step:

```html
<script type="module" src="/node_modules/{{projectName}}/dist/elements.js"></script>
<ui-counter></ui-counter>
```
