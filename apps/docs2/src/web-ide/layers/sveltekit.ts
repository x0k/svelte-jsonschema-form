import packageJson from "%/basic-starter/package.json";
import svelteConfigJs from "%/basic-starter/svelte.config?raw";
import tsconfigJson from "%/basic-starter/tsconfig.json?raw";
import appHtml from "%/basic-starter/src/app.html?raw";

import type { Layer } from "../layer";

const files = {
  "svelte.config.js": svelteConfigJs,
  "tsconfig.json": tsconfigJson,
  "src/app.html": appHtml,
} as const;

const {
  dependencies: { ajv: _, "@sjsf/ajv8-validator": _1, ...dependencies },
  ...packageJsonRest
} = packageJson;

export const layer = {
  package: {
    ...packageJsonRest,
    dependencies,
  },
  vite: {
    plugins: {
      "@sveltejs/kit/vite": {
        import: "{ sveltekit }",
        call: "sveltekit()",
      },
    },
  },
  files,
} satisfies Layer;
