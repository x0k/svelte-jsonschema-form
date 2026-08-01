import { createSvelteKitIntegration } from "meta/codegen";

import { POST_MODEL_NAME, type Context } from "./model.js";
import { svelteConfig } from "./sv-utils.js";

export function sveltekitTs({
  isKit,
  options: { sveltekit, demo },
  directory,
  language,
  sv,
  ts,
  isTs,
  validator,
  cwd,
  lib,
}: Context) {
  if (!isKit || sveltekit === "no" || !demo) {
    return;
  }

  const { filename, transform } = createSvelteKitIntegration({
    isTs,
    lib,
    sveltekit,
    ts,
    modelName: POST_MODEL_NAME,
    validator,
  });
  sv.file(
    `${directory.kitRoutes}/demo/sjsf/${filename}.${language}`,
    transform
  );

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
