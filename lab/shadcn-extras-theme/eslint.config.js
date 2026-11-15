import { defineConfig } from "eslint/config";

import { svelteConfig } from "../../eslint.config.js";

export default defineConfig(
  svelteConfig,
  {
    rules: {
      "svelte/no-navigation-without-resolve": "warn",
    },
  },
  {
    // These widgets wrap components copied from the shadcn-svelte-extras
    // registry and are replaced when the registry is updated, so their imports
    // must stay exactly as the registry writes them.
    files: ["src/lib/theme/extra-widgets/**"],
    rules: {
      "group-index/prefer": "off",
    },
  }
);
