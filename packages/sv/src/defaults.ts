import {
  iconSetPackage,
  isSubTheme,
  themeParent,
  themePackage,
  formIdBuilderSubPath,
  kitRemoteFunctionsSubPath,
  externalValidatorPackage,
  isInternalValidator,
  internalValidatorSubPath,
  formResolverSubPath,
  formTranslationSubPath,
  formMergerSubPath,
  kitPackage,
  formPackage,
} from "meta";

import { createReExport, getTopLevelFunction, transforms } from "./sv-utils.js";
import type { Context, SvelteKitIntegrationOption } from "./model.js";

const SVELTE_KIT_INTEGRATION_OPTION_ID_BUILDERS: Record<
  SvelteKitIntegrationOption,
  string
> = {
  no: formIdBuilderSubPath("modern"),
  formActions: kitPackage.name,
  remoteFunctions: kitRemoteFunctionsSubPath(),
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
      const validator = options.validator;
      const isAjv = validator === "ajv8";

      if (isAjv && isTs) {
        js.imports.addNamed(ast, {
          from: formPackage.name,
          imports: ["ValidatorFactoryOptions"],
          isType: true,
        });
      }

      createReExport(ast, {
        name: "resolver",
        source: formResolverSubPath("basic"),
      });
      createReExport(ast, {
        name: "translation",
        source: formTranslationSubPath("en"),
      });
      createReExport(ast, {
        name: "merger",
        imported: "createFormMerger",
        source: formMergerSubPath("modern"),
      });
      createReExport(ast, {
        name: "idBuilder",
        imported: "createFormIdBuilder",
        source: SVELTE_KIT_INTEGRATION_OPTION_ID_BUILDERS[options.sveltekit],
      });
      const theme = isSubTheme(options.themeOrSubTheme)
        ? themeParent(options.themeOrSubTheme)
        : options.themeOrSubTheme;
      createReExport(ast, {
        name: "theme",
        source: themePackage(theme).name,
      });
      if (options.icons !== "none") {
        createReExport(ast, {
          name: "icons",
          source: iconSetPackage(options.icons).name,
        });
      }

      if (getTopLevelFunction(ast, "validator")) {
        return;
      }

      if (isAjv) {
        js.imports.addNamed(ast, {
          from: externalValidatorPackage(validator).name,
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
          source: isInternalValidator(validator)
            ? internalValidatorSubPath(validator)
            : externalValidatorPackage(validator).name,
        });
      }
    }),
  );
}
