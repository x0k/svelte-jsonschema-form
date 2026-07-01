import { defineConfig } from "eslint/config";

import { svelteConfig } from "../../eslint.config.js";

export default defineConfig(svelteConfig, {
  rules: {
    "svelte/no-navigation-without-resolve": "warn",
  },
});
