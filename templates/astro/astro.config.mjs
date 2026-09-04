// @ts-check
import ilha from "@ilha/astro";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [ilha()],
});
