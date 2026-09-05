import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseArgs } from "../src/args.ts";

describe("parseArgs", () => {
  it("defaults to an empty, interactive run", () => {
    const options = parseArgs([]);
    assert.equal(options.directory, undefined);
    assert.equal(options.template, undefined);
    assert.equal(options.install, undefined);
    assert.equal(options.git, undefined);
    assert.equal(options.yes, false);
    assert.deepEqual(options.unknown, []);
  });

  it("reads the positional directory", () => {
    assert.equal(parseArgs(["my-app"]).directory, "my-app");
    assert.equal(parseArgs(["my-app", "second"]).directory, "my-app");
  });

  it("reads --template and -t, inline or spaced", () => {
    assert.equal(parseArgs(["--template", "blog"]).template, "blog");
    assert.equal(parseArgs(["--template=blog"]).template, "blog");
    assert.equal(parseArgs(["-t", "blog"]).template, "blog");
  });

  it("reads the package manager and rejects unknown ones", () => {
    assert.equal(parseArgs(["--pm", "pnpm"]).packageManager, "pnpm");
    assert.equal(parseArgs(["--package-manager", "bun"]).packageManager, "bun");
    const bad = parseArgs(["--pm", "cargo"]);
    assert.equal(bad.packageManager, undefined);
    assert.deepEqual(bad.unknown, ["--pm cargo"]);
  });

  it("supports negated boolean flags", () => {
    assert.equal(parseArgs(["--no-install"]).install, false);
    assert.equal(parseArgs(["--install"]).install, true);
    assert.equal(parseArgs(["--no-git"]).git, false);
    assert.equal(parseArgs(["--git"]).git, true);
  });

  it("collects short flags", () => {
    const options = parseArgs(["-y", "-f", "-l"]);
    assert.equal(options.yes, true);
    assert.equal(options.overwrite, true);
    assert.equal(options.list, true);
  });

  it("reports unknown flags instead of ignoring them", () => {
    assert.deepEqual(parseArgs(["--nope"]).unknown, ["--nope"]);
    assert.deepEqual(parseArgs(["--template"]).unknown, ["--template (missing value)"]);
  });
});
