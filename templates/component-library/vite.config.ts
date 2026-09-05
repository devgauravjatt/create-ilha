import { resolve } from "node:path";
import { defineConfig } from "vite";

// Library mode: `vite build` emits ESM bundles for each entry, and
// `tsc --project tsconfig.build.json` emits the matching .d.ts files.
export default defineConfig({
  build: {
    lib: {
      entry: {
        elements: resolve(import.meta.dirname, "src/elements.ts"),
        index: resolve(import.meta.dirname, "src/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      // Peer dependencies stay external so consumers dedupe them.
      external: [/^effect(\/.*)?$/, /^ilha(\/.*)?$/],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
