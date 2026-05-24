import appCss from "examples/shadcn4-starter/src/app.css?raw";
import componentsJson from "examples/shadcn4-starter/components.json?raw";
import utilsTs from "examples/shadcn4-starter/src/lib/utils?raw";
import layoutSvelte from "examples/shadcn4-starter/src/routes/+layout.svelte?raw";

import { optionalPackageName } from "../../package.ts";
import { defineLayer, themeDependencies } from "../layer.ts";

export default defineLayer({
  package: {
    dependencies: Array.from(
      themeDependencies("shadcn4", [
        optionalPackageName("internationalizedDate"),
        optionalPackageName("fontsourceVariableInter"),
        optionalPackageName("twAnimateCss"),
      ]),
    ),
  },
  formDefaults: { theme: "shadcn4" },
  files: {
    "src/routes/+layout.svelte": layoutSvelte,
    "src/lib/utils.ts": utilsTs,
    "src/app.css": appCss,
    "components.json": componentsJson,
  },
});
