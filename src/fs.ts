/**
 * File-system helpers used while copying a template into the target directory.
 */

import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Files npm refuses to publish (or rewrites) inside a package are stored with a
 * leading underscore in `templates/` and restored on copy.
 */
const RENAMED_FILES: Record<string, string> = {
  _env: ".env",
  _gitignore: ".gitignore",
  _npmrc: ".npmrc",
  _vscode: ".vscode",
};

/** Extensions that may contain `{{projectName}}` placeholders. */
const TEXT_EXTENSIONS = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

export const exists = async (target: string) => {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
};

export const isDirectory = async (target: string) => {
  try {
    const stats = await stat(target);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

export const readDirEntries = async (target: string) => {
  try {
    return await readdir(target);
  } catch {
    return [];
  }
};

export const isEmptyDir = async (target: string) => {
  const entries = await readDirEntries(target);
  return entries.length === 0 || (entries.length === 1 && entries[0] === ".git");
};

/** Remove everything inside `target`, keeping `.git` so history survives. */
export const emptyDir = async (target: string) => {
  const entries = await readDirEntries(target);
  await Promise.all(
    entries
      .filter((entry) => entry !== ".git")
      .map((entry) => rm(path.join(target, entry), { force: true, recursive: true }))
  );
};

/** Never copied out of a template, and never scanned for placeholders. */
const SKIPPED_DIRS = new Set([".git", "dist", "node_modules"]);

const renameEntry = (name: string) => RENAMED_FILES[name] ?? name;

/** Recursively copy a template directory, restoring dotfile names as it goes. */
export const copyTemplate = async (from: string, to: string) => {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => !SKIPPED_DIRS.has(entry.name))
      .map((entry) => {
        const source = path.join(from, entry.name);
        const destination = path.join(to, renameEntry(entry.name));
        return entry.isDirectory() ? copyTemplate(source, destination) : cp(source, destination);
      })
  );
};

const listFiles = async (target: string): Promise<string[]> => {
  const entries = await readdir(target, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !SKIPPED_DIRS.has(entry.name))
      .map((entry) => {
        const full = path.join(target, entry.name);
        return entry.isDirectory() ? listFiles(full) : [full];
      })
  );
  return nested.flat();
};

/** Replace `{{projectName}}` (and friends) in the text files of a project. */
export const applyPlaceholders = async (target: string, values: Record<string, string>) => {
  const files = await listFiles(target);
  await Promise.all(
    files.map(async (file) => {
      if (!TEXT_EXTENSIONS.has(path.extname(file))) {
        return;
      }
      const original = await readFile(file, "utf-8");
      const replaced = original.replaceAll(
        /\{\{(?<key>\w+)\}\}/gu,
        (match, key: string) => values[key] ?? match
      );
      if (replaced !== original) {
        await writeFile(file, replaced);
      }
    })
  );
};

const omit = (source: Record<string, unknown>, keys: string[]) =>
  Object.fromEntries(Object.entries(source).filter(([key]) => !keys.includes(key)));

/** Rewrite the scaffolded `package.json` with the project's own identity. */
export const writeProjectManifest = async (target: string, name: string) => {
  const manifestPath = path.join(target, "package.json");
  if (!(await exists(manifestPath))) {
    return;
  }
  const manifest = JSON.parse(await readFile(manifestPath, "utf-8")) as Record<string, unknown>;
  const updated = { name, private: true, version: "0.0.0", ...omit(manifest, ["name", "version"]) };
  await writeFile(manifestPath, `${JSON.stringify(updated, null, 2)}\n`);
};
