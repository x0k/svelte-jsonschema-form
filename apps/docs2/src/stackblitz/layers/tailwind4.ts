import layoutSvelte from "%/daisyui5-starter/src/routes/+layout.svelte?raw";

import type { Layer } from "../layer";

export const layer = {
  package: {
    devDependencies: {
      "@tailwindcss/vite": "^4.0.0",
      tailwindcss: "^4.0.0",
    },
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
} satisfies Layer;
