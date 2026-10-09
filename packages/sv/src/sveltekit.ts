import { createSvelteKitIntegration } from "meta/codegen";

import { POST_MODEL_NAME, type Context } from "./model.js";
import { svelteConfig } from "./sv-utils.js";

export function sveltekitTs({
  options: { sveltekit, demo },
  demoPage,
  language,
  sv,
  ts,
  isTs,
  validator,
  cwd,
  lib,
  kit,
}: Context) {
  if (sveltekit === "no" || !demo || !demoPage) {
    return;
  }

  const { filename, transform } = createSvelteKitIntegration({
    isTs,
    lib,
    sveltekit,
    sveltekitPackage: kit.pkg,
    ts,
    modelName: POST_MODEL_NAME,
    validator,
  });
  sv.file(`${demoPage.addonPath}/${filename}.${language}`, transform);

  if (sveltekit === "remoteFunctions") {
    svelteConfig.edit({ sv, cwd }, ({ override }) => {
      override({
        compilerOptions: {
          experimental: {
            async: true,
          },
        },
        experimental: {
          remoteFunctions: true,
        },
      });
    });
  }
}
