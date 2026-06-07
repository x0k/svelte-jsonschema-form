import { createSvelteKitIntegration } from "meta/codegen";

import { POST_MODEL_NAME, type Context } from "./model.js";
import { transforms } from "./sv-utils.js";

export function sveltekitTs({
  file,
  isKit,
  options: { sveltekit, demo },
  directory,
  language,
  sv,
  ts,
  isTs,
  lib,
  validator,
}: Context) {
  if (!isKit || sveltekit === "no") {
    return;
  }

  if (demo) {
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
      transform,
    );
  }

  if (sveltekit === "remoteFunctions") {
    sv.file(
      file.svelteConfig,
      transforms.script(({ ast, js }) => {
        const { value: svelteConfig } = js.exports.createDefault(ast, {
          fallback: js.object.create({}),
        });
        js.object.overrideProperties(svelteConfig, {
          compilerOptions: {
            experimental: {
              async: true,
            },
          },
          kit: {
            experimental: {
              remoteFunctions: true,
            },
          },
        });
      }),
    );
  }
}
