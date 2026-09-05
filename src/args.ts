/**
 * Argument parsing for `create-ilha`.
 */

import { isPackageManager } from "./system.ts";
import type { PackageManager } from "./system.ts";

export interface CliOptions {
  /** Positional target directory, when given. */
  directory?: string;
  template?: string;
  packageManager?: PackageManager;
  install?: boolean;
  git?: boolean;
  start?: boolean;
  overwrite: boolean;
  yes: boolean;
  help: boolean;
  version: boolean;
  list: boolean;
  /** Unknown flags, reported instead of silently ignored. */
  unknown: string[];
}

const BOOLEAN_FLAGS: Record<string, (options: CliOptions) => void> = {
  "--force": (options) => {
    options.overwrite = true;
  },
  "--git": (options) => {
    options.git = true;
  },
  "--help": (options) => {
    options.help = true;
  },
  "--install": (options) => {
    options.install = true;
  },
  "--list": (options) => {
    options.list = true;
  },
  "--no-git": (options) => {
    options.git = false;
  },
  "--no-install": (options) => {
    options.install = false;
  },
  "--no-start": (options) => {
    options.start = false;
  },
  "--overwrite": (options) => {
    options.overwrite = true;
  },
  "--start": (options) => {
    options.start = true;
  },
  "--version": (options) => {
    options.version = true;
  },
  "--yes": (options) => {
    options.yes = true;
  },
};

const SHORT_FLAGS: Record<string, string> = {
  "-f": "--force",
  "-h": "--help",
  "-l": "--list",
  "-v": "--version",
  "-y": "--yes",
};

const VALUE_FLAGS = new Set(["--template", "--package-manager", "--pm", "-t", "-p"]);

export const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = {
    help: false,
    list: false,
    overwrite: false,
    unknown: [],
    version: false,
    yes: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const raw = argv[index] ?? "";
    const arg = SHORT_FLAGS[raw] ?? raw;

    if (VALUE_FLAGS.has(raw) || raw.startsWith("--template=") || raw.startsWith("--pm=")) {
      const inlineIndex = raw.indexOf("=");
      let name = raw;
      let value: string | undefined;
      if (inlineIndex === -1) {
        index += 1;
        value = argv[index];
      } else {
        name = raw.slice(0, inlineIndex);
        value = raw.slice(inlineIndex + 1);
      }
      if (!value) {
        options.unknown.push(`${name} (missing value)`);
        continue;
      }
      if (name === "--template" || name === "-t") {
        options.template = value;
      } else if (isPackageManager(value)) {
        options.packageManager = value;
      } else {
        options.unknown.push(`${name} ${value}`);
      }
      continue;
    }

    const applyBoolean = BOOLEAN_FLAGS[arg];
    if (applyBoolean) {
      applyBoolean(options);
      continue;
    }

    if (raw.startsWith("-")) {
      options.unknown.push(raw);
      continue;
    }

    options.directory ??= raw;
  }

  return options;
};

export const HELP = `
  Usage: create-ilha [directory] [options]

  Options:
    -t, --template <name>   Template to scaffold (see --list)
    -p, --pm <manager>      Package manager: npm | pnpm | yarn | bun
        --install           Install dependencies
        --no-install        Skip installing dependencies
        --git               Initialize a git repository
        --no-git            Skip git initialization
        --start             Start the dev server when scaffolding is done
    -f, --force             Overwrite a non-empty target directory
    -y, --yes               Accept every default, skip the prompts
    -l, --list              List the available templates
    -v, --version           Print the version
    -h, --help              Show this help

  Examples:
    npm create ilha@latest
    npm create ilha@latest my-app -- --template oxide-spa
    pnpm create ilha my-app --template dashboard --no-install
    bun create ilha my-app -y
`;
