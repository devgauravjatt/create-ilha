import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      // A CLI binary — no declaration files to publish.
      banner: { js: "#!/usr/bin/env node" },
      dts: false,
      syntax: ["node 22"],
    },
  ],
});
