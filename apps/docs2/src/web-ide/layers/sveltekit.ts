import packageJson from "%/basic-starter/package.json";
import tsconfigJson from "%/basic-starter/tsconfig.json?raw";
import appHtml from "%/basic-starter/src/app.html?raw";

import { omitBasePackages, type Layer } from "../layer";

const files = {
  "tsconfig.json": tsconfigJson,
  "src/app.html": appHtml,
} as const;

export const layer = {
  package: omitBasePackages(packageJson),
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
