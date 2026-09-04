import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  // Templates are scaffolding payload, not source of this package: they carry
  // their own tooling and are formatted by the projects generated from them.
  ignorePatterns: ["templates/**"],
  printWidth: 100,
});
