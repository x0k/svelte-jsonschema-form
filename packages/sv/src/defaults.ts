import { iconSetPackage, themeOrSubThemePackage, validatorPackage } from "meta";

import { createReExport, getTopLevelFunction, transforms } from "./sv-utils.js";
import type { Context, SvelteKitIntegrationOption } from "./model.js";

const SVELTE_KIT_INTEGRATION_OPTION_ID_BUILDERS: Record<
  SvelteKitIntegrationOption,
  string
> = {
  no: "@sjsf/form/id-builders/modern",
  formActions: "@sjsf/sveltekit",
  remoteFunctions: "@sjsf/sveltekit/rf",
};

export function defaultsTs({
  options,
  isTs,
  sv,
  directory,
  language,
}: Context) {
  sv.file(
    `${directory.lib}/sjsf/defaults.${language}`,
    transforms.script(({ ast, comments, js }) => {
      const isAjv = options.validator === "ajv8";

      if (isAjv && isTs) {
        js.imports.addNamed(ast, {
          from: "@sjsf/form",
          imports: ["ValidatorFactoryOptions"],
          isType: true,
        });
      }

      createReExport(ast, {
        name: "resolver",
        source: "@sjsf/form/resolvers/basic",
      });
      createReExport(ast, {
        name: "translation",
        source: "@sjsf/from/translations/en",
      });
      createReExport(ast, {
        name: "merger",
        imported: "createFormMerger",
        source: "@sjsf/form/mergers/modern",
      });
      createReExport(ast, {
        name: "idBuilder",
        imported: "createFormIdBuilder",
        source: SVELTE_KIT_INTEGRATION_OPTION_ID_BUILDERS[options.sveltekit],
      });
      createReExport(ast, {
        name: "theme",
        source: themeOrSubThemePackage(options.theme),
      });
      if (options.icons !== "none") {
        createReExport(ast, {
          name: "icons",
          source: iconSetPackage(options.icons),
        });
      }

      if (getTopLevelFunction(ast, "validator")) {
        return;
      }

      if (isAjv) {
        js.imports.addNamed(ast, {
          from: validatorPackage(options.validator),
          imports: ["addFormComponents", "createFormValidator"],
        });
        js.imports.addDefault(ast, {
          from: "ajv-formats",
          as: "addFormats",
        });

        js.common.appendFromString(ast, {
          code: isTs
            ? // NOTE: Svelte ignores the generic type in an arrow function
              `function validator<T>(options: ValidatorFactoryOptions) {
  return createFormValidator<T>({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });
}
export { validator }`
            : `/**
 * @template T
 * @param {import("@sjsf/form").ValidatorFactoryOptions} options
 * @returns {ReturnType<typeof createFormValidator<T>>}
 */
export const validator = (options) => createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });`,
          comments,
        });
      } else {
        createReExport(ast, {
          name: "validator",
          imported: "createFormValidator",
          source: validatorPackage(options.validator),
        });
      }
    }),
  );
}
