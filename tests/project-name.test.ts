import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isValidPackageName, toValidPackageName } from "../src/project-name.ts";

describe("toValidPackageName", () => {
  it("keeps names that are already valid", () => {
    assert.equal(toValidPackageName("my-app"), "my-app");
    assert.equal(toValidPackageName("@scope/app"), "@scope/app");
  });

  it("normalizes case, spaces and punctuation", () => {
    assert.equal(toValidPackageName("My App"), "my-app");
    assert.equal(toValidPackageName("  Ilha Demo!  "), "ilha-demo");
    assert.equal(toValidPackageName(".hidden"), "hidden");
  });

  it("falls back when nothing usable is left", () => {
    assert.equal(toValidPackageName("---"), "ilha-app");
    assert.equal(toValidPackageName(""), "ilha-app");
  });

  it("produces names npm accepts", () => {
    for (const input of ["My App", "  Ilha Demo!  ", "@scope/app", "___"]) {
      assert.ok(isValidPackageName(toValidPackageName(input)), input);
    }
  });
});
