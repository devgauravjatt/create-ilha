# {{projectName}}

> Built with [Ilha](https://ilha.build) — the `blog` template.

A content site rendered on the server with [Oxide](https://oxide.build). Post data lives in server islands — the list, the post bodies and the reaction counts all render on the server, so content and queries never reach the browser. `about.server.tsx` shows the other half of the story: a whole route rendered on the server.

## Getting started

```bash
{{packageManager}} install
{{packageManager}} run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command                            | Description                         |
| ---------------------------------- | ----------------------------------- |
| `{{packageManager}} run dev`       | Start the Vite development server   |
| `{{packageManager}} run build`     | Build the server and client bundles |
| `{{packageManager}} run preview`   | Preview the production build        |
| `{{packageManager}} run start`     | Run the production server           |
| `{{packageManager}} run typecheck` | Type-check without emitting files   |

## Project layout

```text
src/
  lib/
    posts.ts               # Content — swap for a CMS or database
    posts.server.tsx       # Server island: renders a post body on the server
    reactions.server.tsx   # Server island: actions + a PubSub stream
  pages/
    +layout.tsx            # Shell and <head> defaults
    +error.tsx             # Error boundary
    index.tsx              # Client page hosting the PostList server island
    posts/[slug].tsx       # Client page hosting the post body + reactions
    about.server.tsx       # A whole route rendered on the server
    [...slug].tsx          # 404
  client.ts                # Client entry — mounts islands
  server.ts                # Oxide server entry
  app.css                  # Tailwind CSS + daisyUI
```

## Routes and islands

| Route          | File                        | Renders                                     |
| -------------- | --------------------------- | ------------------------------------------- |
| `/`            | `pages/index.tsx`           | Client page + `PostList` server island      |
| `/posts/:slug` | `pages/posts/[slug].tsx`    | Client page + `PostView` and `ReactionButton` |
| `/about`       | `pages/about.server.tsx`    | Whole route on the server                   |

On a cold `dev` start the very first frame request can beat the island registry and come back empty — reload once and it renders. Production builds are unaffected.

## Frames and auth

`src/server.ts` opens frames with `setFrameAuth({ defaultAction: "open" })` because the demo data is public. Serving private data? Install `setFrameGuard()` and read
[middleware and security](https://ilha.build/guide/routing/middleware-and-security/).
