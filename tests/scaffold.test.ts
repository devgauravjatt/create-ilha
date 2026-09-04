import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const cli = path.join(repoRoot, "dist", "index.js");

const run = (args: string[], cwd: string) =>
  spawnSync(process.execPath, [cli, ...args], { cwd, encoding: "utf-8" });

let workDir = "";

describe("create-ilha end to end", () => {
  before(async () => {
    workDir = await mkdtemp(path.join(tmpdir(), "create-ilha-"));
    // `dist/index.js` is built by the `test` script; fail loudly if it is not there.
    await readFile(cli, "utf-8");
  });

  after(async () => {
    await rm(workDir, { force: true, recursive: true });
  });

  it("prints the template list", () => {
    const result = run(["--list"], workDir);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /vite-spa/u);
    assert.match(result.stdout, /oxide-spa/u);
  });

  it("prints help", () => {
    const result = run(["--help"], workDir);
    assert.equal(result.status, 0);
    assert.match(result.stdout, /Usage: create-ilha/u);
  });

  it("rejects unknown flags", () => {
    const result = run(["--definitely-not-a-flag"], workDir);
    assert.equal(result.status, 1);
  });

  it("scaffolds a project without prompting", async () => {
    const result = run(
      ["demo-app", "--template", "minimal", "--no-install", "--no-git", "--yes"],
      workDir
    );
    assert.equal(result.status, 0, result.stderr);

    const projectDir = path.join(workDir, "demo-app");
    const entries = await readdir(projectDir);
    assert.ok(entries.includes("package.json"));
    assert.ok(entries.includes(".gitignore"), "_gitignore should be restored");
    assert.ok(!entries.includes("_gitignore"));

    const manifest = JSON.parse(await readFile(path.join(projectDir, "package.json"), "utf-8")) as {
      name: string;
      private: boolean;
    };
    assert.equal(manifest.name, "demo-app");
    assert.equal(manifest.private, true);

    const readme = await readFile(path.join(projectDir, "README.md"), "utf-8");
    assert.match(readme, /# demo-app/u);
    assert.ok(!readme.includes("{{"), "placeholders should be replaced");
  });

  it("resolves template aliases", async () => {
    const result = run(
      ["aliased", "--template", "blank", "--no-install", "--no-git", "--yes"],
      workDir
    );
    assert.equal(result.status, 0, result.stderr);
    const readme = await readFile(path.join(workDir, "aliased", "README.md"), "utf-8");
    assert.match(readme, /the `minimal` template/u);
  });

  it("refuses a non-empty directory unless forced", async () => {
    const projectDir = path.join(workDir, "occupied");
    await writeFile(path.join(workDir, "occupied.txt"), "");
    const result = run(["demo-app", "--no-install", "--no-git", "--yes"], workDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr + result.stdout, /not empty/u);

    const forced = run(
      ["demo-app", "--template", "minimal", "--force", "--no-install", "--no-git", "--yes"],
      workDir
    );
    assert.equal(forced.status, 0, forced.stderr);
    assert.ok(projectDir);
  });

  it("fails on an unknown template", () => {
    const result = run(["other-app", "--template", "nope", "--yes", "--no-install"], workDir);
    assert.equal(result.status, 1);
    assert.match(result.stderr + result.stdout, /Unknown template/u);
  });
});
