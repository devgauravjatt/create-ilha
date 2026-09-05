import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { DEFAULT_TEMPLATE, findTemplate, TEMPLATES } from "../src/templates.ts";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const templatesRoot = path.join(repoRoot, "templates");

describe("template registry", () => {
  it("resolves templates by id and by alias", () => {
    assert.equal(findTemplate("vite-spa")?.id, "vite-spa");
    assert.equal(findTemplate("SPA")?.id, "vite-spa");
    assert.equal(findTemplate("ssr")?.id, "oxide-spa");
    assert.equal(findTemplate("blank")?.id, "minimal");
    assert.equal(findTemplate("does-not-exist"), undefined);
  });

  it("has a default template", () => {
    assert.ok(findTemplate(DEFAULT_TEMPLATE));
  });

  it("uses unique ids and aliases", () => {
    const names = TEMPLATES.flatMap((template) => [template.id, ...(template.aliases ?? [])]);
    assert.equal(new Set(names).size, names.length);
  });

  it("ships a directory for every registered template", async () => {
    await Promise.all(
      TEMPLATES.map(async (template) => {
        const stats = await stat(path.join(templatesRoot, template.id));
        assert.ok(stats.isDirectory(), `${template.id} has no directory`);
      })
    );
  });

  it("registers every directory in templates/", async () => {
    const entries = await readdir(templatesRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        assert.ok(findTemplate(entry.name), `templates/${entry.name} is not registered`);
      }
    }
  });

  it("gives every template a package.json and a README", async () => {
    await Promise.all(
      TEMPLATES.map(async (template) => {
        const dir = path.join(templatesRoot, template.id);
        const manifest = JSON.parse(await readFile(path.join(dir, "package.json"), "utf-8")) as {
          name?: string;
        };
        assert.equal(manifest.name, "{{projectName}}", `${template.id} has a hard-coded name`);
        await stat(path.join(dir, "README.md"));
      })
    );
  });

  it("stores dotfiles under their underscore names", async () => {
    await Promise.all(
      TEMPLATES.map(async (template) => {
        const entries = await readdir(path.join(templatesRoot, template.id));
        assert.ok(entries.includes("_gitignore"), `${template.id} is missing _gitignore`);
        assert.ok(!entries.includes(".gitignore"), `${template.id} ships an unpublishable dotfile`);
      })
    );
  });
});
