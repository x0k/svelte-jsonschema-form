import { createSvelteKitIntegration } from "meta/codegen";

import type { Context } from "./model.js";
import { transforms } from "./sv-utils.js";

export function sveltekitTs({
  file,
  isKit,
  options: { sveltekit, demo, validatorWithSuffix },
  directory,
  language,
  sv,
  ts,
  isTs,
  lib,
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
      validatorWithSuffix,
    });
    sv.file(
      `${directory.kitRoutes}/demo/sjsf/${filename}.${language}`,
      transform,
    );
  }

  if (sveltekit === "remoteFunctions") {
    sv.file(
      file.viteConfig,
      transforms.script(({ ast, js, comments }) => {
        const viteConfig = js.vite.getConfig(ast);

        const optimizeDeps = js.vite.configProperty(ast, viteConfig, {
          name: "optimizeDeps",
          fallback: js.object.create({}),
        });

        let exclude = js.object.property(optimizeDeps, {
          name: "exclude",
          fallback: js.array.create(),
        });

        if (exclude.type !== "ArrayExpression") {
          const prev = exclude;
          exclude = js.array.create();
          js.array.append(exclude, prev);
          js.object.overrideProperties(optimizeDeps, {
            exclude,
          });
        }

        comments.add(exclude, {
          type: "Line",
          value: " https://github.com/sveltejs/kit/issues/14788",
        });

        js.array.append(exclude, "@sjsf/form");
        js.array.append(exclude, "@sjsf/sveltekit/rf/client");
      }),
    );

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
