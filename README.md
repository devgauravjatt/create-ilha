# create-ilha

> The official project scaffolding tool for [Ilha](https://ilha.build).

Create a new Ilha application in seconds: pick a template, pick a package manager, and start building. No global install, no runtime dependencies.

```bash
npm create ilha@latest
```

## Usage

```bash
# Interactive
npm create ilha@latest

# Non-interactive
npm create ilha@latest my-app -- --template oxide-spa --pm pnpm --no-install

# Other package managers
pnpm create ilha my-app --template dashboard
bun create ilha my-app -y
```

### Options

| Flag                         | Description                                   |
| ---------------------------- | --------------------------------------------- |
| `-t, --template <name>`      | Template to scaffold (id or alias, see below) |
| `-p, --pm <manager>`         | `npm`, `pnpm`, `yarn` or `bun`                |
| `--install` / `--no-install` | Install dependencies after scaffolding        |
| `--git` / `--no-git`         | Create a git repository and an initial commit |
| `--start`                    | Start the dev server when scaffolding is done |
| `-f, --force`                | Overwrite a non-empty target directory        |
| `-y, --yes`                  | Accept every default and skip the prompts     |
| `-l, --list`                 | List the available templates                  |
| `-v, --version`              | Print the version                             |
| `-h, --help`                 | Show help                                     |

Without flags the CLI asks for the directory, template, package name, package manager, git and install. It detects the package manager that invoked it (`npm create`, `pnpm create`, `bun create`) and offers that first.

## Templates

| Template | Aliases | What you get |
| --- | --- | --- |
| `minimal` | `blank`, `basic` | Vite + one island, no router, plain CSS |
| `vite-spa` | `spa`, `vite` | Client SPA: file routes, layouts, Tailwind CSS + daisyUI |
| `oxide-spa` | `ssr`, `oxide`, `server-islands` | Oxide server, server pages and [server islands][islands] |
| `landing` | `marketing` | Landing page: hero, features, pricing, waitlist form |
| `dashboard` | `admin` | App shell: sidebar, stats, filterable table, dynamic route, error boundary |
| `blog` | `oxide-blog` | Server-rendered content site with a streaming reactions island |
| `showcase` | `portfolio` | Personal site: project grid, about page, validated contact form |
| `component-library` | `library`, `ui` | Publishable library with a playground and custom elements |
| `astro` | `astro-islands` | Astro site that hydrates Ilha islands via `@ilha/astro` |

The `vite-spa` and `oxide-spa` templates mirror the [official templates](https://github.com/ilhajs/ilha/tree/main/templates) in the Ilha repository.

Every template ships with TypeScript, a README, a `.gitignore` and scripts for `dev`, `build` and `preview`.

## What the CLI does

1. Copies the template, restoring dotfiles (`_gitignore` → `.gitignore`).
2. Replaces `{{projectName}}` and `{{packageManager}}` placeholders.
3. Rewrites `package.json` with your project name.
4. Optionally installs dependencies with your package manager.
5. Optionally runs `git init` and commits the scaffold.
6. Prints the next steps and the docs links that matter for the template you chose.

## Development

```bash
pnpm install
pnpm build       # bundle src/ to dist/index.js
pnpm test        # build, then run the unit and end-to-end tests
pnpm typecheck   # tsc --noEmit
pnpm lint        # ultracite check
```

Adding a template:

1. Create `templates/<id>/` — store dotfiles as `_gitignore`, `_npmrc`, `_env`.
2. Use `{{projectName}}` in `package.json`, `README.md` and page titles, and `{{packageManager}}` in docs commands.
3. Register it in `src/templates.ts` with a label, hint, description and aliases.

`tests/templates.test.ts` checks that every directory is registered and every registered template ships the expected files.

## Links

- [Ilha docs](https://ilha.build)
- [Server islands guide][islands]
- [Showcase](https://ilha.build/guide/resources/showcase/)
- [Discord](https://discord.gg/WnVTMCTz74)

[islands]: https://ilha.build/guide/routing/server-islands/

## License

MIT
