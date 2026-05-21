import layoutSvelte from "examples/daisyui5-starter/src/routes/+layout.svelte?raw";

import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

export const layer = defineLayer({
  package: {
    dependencies: [
      extraPackage("tailwindcss4"),
      extraPackage("tailwindcss4Vite"),
    ],
  },
  vite: {
    plugins: {
      "@tailwindcss/vite": {
        import: "tailwindcss",
        call: "tailwindcss()",
      },
    },
  },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/app.css": "@import 'tailwindcss'",
  },
});
