import appCss from "%/daisyui-starter/src/app.css?raw";
import layoutSvelte from '%/daisyui-starter/src/routes/+layout.svelte?raw';
import postcssConfigJs from '%/daisyui-starter/postcss.config.js?raw'

import type { Layer } from "../layer";

export const layer = {
  package: {
    devDependencies: {
      tailwindcss: "^3.4.17",
      postcss: "^8.5.6",
    },
  },
  files: {
    "src/app.css": appCss,
    "src/routes/+layout.svelte": layoutSvelte,
    "postcss.config.js": postcssConfigJs,
  }
} satisfies Layer;
