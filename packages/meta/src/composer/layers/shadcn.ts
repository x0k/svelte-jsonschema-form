import appCss from "examples/shadcn-starter/src/app.css?raw";
import componentsJson from "examples/shadcn-starter/components.json?raw";
import utilsTs from "examples/shadcn-starter/src/lib/utils?raw";
import layoutSvelte from "examples/shadcn-starter/src/routes/+layout.svelte?raw";
import tailwindConfigJs from "examples/shadcn-starter/tailwind.config.js?raw";

import { optionalPackageName } from "../../package.ts";
import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: Array.from(
      themeDependencies("shadcn", [
        optionalPackageName("internationalizedDate"),
      ]),
    ),
  },
  formDefaults: { theme: "shadcn" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/lib/utils.ts": utilsTs,
    "src/app.css": appCss,
    "components.json": componentsJson,
    "tailwind.config.js": tailwindConfigJs,
  },
});
