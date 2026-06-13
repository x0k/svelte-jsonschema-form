import { KIT_PATH_FACTORY, createSvelteKitIntegration } from "meta/codegen";

import { POST_MODEL_NAME, type Context } from "./model.js";
import { svelteConfig, transforms } from "./sv-utils.js";

export function sveltekitTs({
  file,
  isKit,
  options: { sveltekit, demo },
  directory,
  language,
  sv,
  ts,
  isTs,
  validator,
  cwd,
}: Context) {
  if (!isKit || sveltekit === "no" || !demo) {
    return;
  }

  const { filename, transform } = createSvelteKitIntegration({
    isTs,
    lib: KIT_PATH_FACTORY,
    sveltekit,
    ts,
    modelName: POST_MODEL_NAME,
    validator,
  });
  sv.file(
    `${directory.kitRoutes}/demo/sjsf/${filename}.${language}`,
    transform,
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
