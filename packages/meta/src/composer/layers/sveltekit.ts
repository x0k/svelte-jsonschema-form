import tsconfigJson from "examples/basic-starter/tsconfig.json?raw";
import appHtml from "examples/basic-starter/src/app.html?raw";

import { sveltekitPackage } from "../../sveltekit.ts";
import { extraPackage } from "../../package.ts";
import { defineLayer } from "../layer.ts";

const files = {
  "tsconfig.json": tsconfigJson,
  "src/app.html": appHtml,
} as const;

export default defineLayer({
  package: {
    dependencies: [
      ...sveltekitPackage.dependencies,
      extraPackage("jsonSchemaToTs"),
      extraPackage("vite"),
      extraPackage("svelteAdapterAuto"),
      extraPackage("svelteVitePlugin"),
      extraPackage("typescript"),
    ],
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
});
