import { defineAddon, defineAddonOptions, type SelectQuestion } from "sv";
import {
  isLabTheme,
  nonLegacyThemeOrSubThemes,
  themeTitle,
  validators,
  validatorTitle,
  isJsonSchemaValidator,
  type Validator,
  type NonLegacyThemeOrSubTheme,
  themeOrSubThemePackage,
  iconSets,
  iconSetTitle,
  iconSetPackage,
  validatorPackage,
} from "meta";

import { createReExport, transforms, createPrinter } from "./sv-utils.js";

const SVELTE_KIT_INTEGRATION_OPTIONS = [
  { value: "no", label: "No" },
  { value: "formActions", label: "Form Actions" },
  {
    value: "remoteFunctions",
    label: "Remote Functions",
    hint: "experimental",
  },
] as const satisfies SelectQuestion<string>["options"];

type SvelteKitIntegrationOption =
  (typeof SVELTE_KIT_INTEGRATION_OPTIONS)[number]["value"];

const SVELTE_KIT_INTEGRATION_OPTION_ID_BUILDERS: Record<
  SvelteKitIntegrationOption,
  string
> = {
  no: "@sjsf/form/id-builders/modern",
  formActions: "@sjsf/sveltekit",
  remoteFunctions: "@sjsf/sveltekit/rf",
};

const options = defineAddonOptions()
  .add("theme", {
    question: "Theme?",
    type: "select",
    default: "basic" satisfies NonLegacyThemeOrSubTheme,
    options: nonLegacyThemeOrSubThemes().map((t) => ({
      value: t,
      label: themeTitle(t),
      hint: isLabTheme(t) ? "experimental" : undefined,
    })),
  })
  .add("shadcnExtras", {
    question: "Add `shadcn-svelte-extras` components (experimental)?",
    type: "boolean",
    default: false,
    condition: (o) => o.theme === "shadcn4",
  })
  .add("icons", {
    question: "Icons?",
    type: "select",
    default: "none",
    options: [
      {
        value: "none",
        label: "None",
      },
      ...iconSets().map((i) => ({
        value: i,
        label: iconSetTitle(i),
      })),
    ],
  })
  .add("validator", {
    question: "Validator?",
    type: "select",
    default: "ajv8" satisfies Validator,
    options: validators().map((v) => ({
      value: v,
      label: validatorTitle(v),
    })),
  })
  .add("typeInference", {
    question:
      "Add library to infer TS types from JSON schemas (json-schema-to-ts)?",
    type: "boolean",
    default: true,
    condition: (o) => isJsonSchemaValidator(o.validator),
  })
  .add("sveltekit", {
    question: "Setup SvelteKit integration?",
    type: "select",
    default: "no" satisfies SvelteKitIntegrationOption,
    options: SVELTE_KIT_INTEGRATION_OPTIONS,
  })
  .build();

export default defineAddon({
  id: "@sjsf/sv",
  options,

  // setup: ({ isKit, unsupported }) => {
  // 	if (!isKit) unsupported('Requires SvelteKit');
  // },

  run: ({ directory, sv, options, language }) => {
    const isTs = language === "ts";
    const [ts] = createPrinter(isTs);

    sv.file(
      `${directory.lib}/sjsf/defaults.${language}`,
      transforms.script(({ ast, content, js, comments }) => {
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

        if (isAjv) {
          js.imports.addNamed(ast, {
            from: validatorPackage(options.validator),
            imports: ["addFormComponents", "createFormValidator"],
          });
          js.imports.addDefault(ast, {
            from: "ajv-formats",
            as: "addFormats",
          });

          // NOTE: All i want is to defined the following function:
          //
          // export const validator = <T>(options: ValidatorFactoryOptions) =>
          //   createFormValidator<T>({
          //     ...options,
          //     ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
          //   });
          //
          // But:
          // - Svelte ignores the generic type T definition
          // - There is currently no way to express `export { validator }`
          // So we get what we get

          js.common.appendFromString(ast, {
            code: isTs
              ? `function validatorWrapper<T>(options: ValidatorFactoryOptions) {
  return createFormValidator<T>({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });
}`
              : `/**
 * @template T
 * @param {import("@sjsf/form").ValidatorFactoryOptions} options
 * @returns {ReturnType<typeof createFormValidator<T>>}
 */
const validatorWrapper = (options) => createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });`,
            comments,
          });
          js.exports.createNamed(ast, {
            name: "validator",
            fallback: js.variables.declaration(ast, {
              kind: "const",
              name: "validator",
              value: js.variables.createIdentifier("validatorWrapper"),
            }),
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
  },
});
