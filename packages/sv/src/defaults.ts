import {
  iconSetPackage,
  isSubTheme,
  themeParent,
  themePackage,
  formIdBuilderSubPath,
  svelteKitRfSubPath,
  externalValidatorPackage,
  isInternalValidator,
  internalValidatorSubPath,
  formTranslationSubPath,
  formMergerSubPath,
  sveltekitPackage,
  formPackage,
  extraFields,
  extraFieldSubPath,
  themeExtraWidgets,
  themeExtraWidgetSubPath,
  isThemeExtension,
  themeExtensionOrigin,
  formCoreSubpath,
  isJsonSchemaValidator,
} from "meta";

import { createReExport, getTopLevelFunction, transforms } from "./sv-utils.js";
import {
  isEndsWithPrecompiled,
  type Context,
  type SvelteKitIntegrationOption,
} from "./model.js";

const SVELTE_KIT_INTEGRATION_OPTION_ID_BUILDERS: Record<
  SvelteKitIntegrationOption,
  string
> = {
  no: formIdBuilderSubPath("modern"),
  formActions: sveltekitPackage.name,
  remoteFunctions: svelteKitRfSubPath(),
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
      const { validatorWithSuffix } = options;
      const isAjv = validatorWithSuffix === "ajv8";

      if (isAjv && isTs) {
        js.imports.addNamed(ast, {
          from: formPackage.name,
          imports: ["ValidatorFactoryOptions"],
          isType: true,
        });
      }

      if (!getTopLevelFunction(ast, "resolver")) {
        js.imports.addNamed(ast, {
          imports: ["getSimpleSchemaType", "isFixedItems"],
          from: formCoreSubpath,
        });
        if (isTs) {
          js.imports.addNamed(ast, {
            imports: ["FormState", "ResolveFieldType"],
            from: formPackage.name,
            isType: true,
          });
        }
        const extraFieldImports: string[] = [];
        for (const f of extraFields({ wrappedFields: false })) {
          extraFieldImports.push(`// import "${extraFieldSubPath(f, true)}";`);
        }
        const resolverCode =
          `${extraFieldImports.join("\n")}\n// https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/\n` +
          (isTs
            ? `export function resolver<T>(_ctx: FormState<T>): ResolveFieldType {`
            : `/**
 * @template T
 * @param {import("@sjsf/form").FormState<T>} ctx
 * @returns {import("@sjsf/form").ResolveFieldType}
 */
export function resolver(_ctx) {`) +
          `\n  return ({ schema }) => {
    if (schema.oneOf !== undefined) {
      return "oneOfField";
    }
    if (schema.anyOf !== undefined) {
      return "anyOfField";
    }
    const type = getSimpleSchemaType(schema);
    if (type === "array") {
      return isFixedItems(schema) ? "tupleField" : "arrayField";
    }
    return \`\${type}Field\`;
  };
}`;
        js.common.appendFromString(ast, {
          code: resolverCode,
          comments,
        });
      }

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
      const themeNode = createReExport(ast, {
        name: "theme",
        source: themePackage(theme).name,
      });
      if (isThemeExtension(theme)) {
        const originTheme = themeExtensionOrigin(theme);
        for (const w of themeExtraWidgets(originTheme)) {
          comments.add(themeNode, {
            type: "Line",
            value: ` import "${themeExtraWidgetSubPath(originTheme, w, true)}";`,
          });
        }
      }
      for (const w of themeExtraWidgets(theme)) {
        comments.add(themeNode, {
          type: "Line",
          value: ` import "${themeExtraWidgetSubPath(theme, w, true)}";`,
        });
      }

      if (options.icons !== "none") {
        createReExport(ast, {
          name: "icons",
          source: iconSetPackage(options.icons).name,
        });
      }

      if (
        getTopLevelFunction(ast, "validator") ||
        isEndsWithPrecompiled(validatorWithSuffix) ||
        !(
          isJsonSchemaValidator(validatorWithSuffix) ||
          validatorWithSuffix === "noop"
        )
      ) {
        return;
      }

      if (isAjv) {
        js.imports.addNamed(ast, {
          from: externalValidatorPackage(validatorWithSuffix).name,
          imports: ["addFormComponents", "createFormValidator"],
        });
        js.imports.addDefault(ast, {
          from: "ajv-formats",
          as: "addFormats",
        });

        js.common.appendFromString(ast, {
          code: isTs
            ? // NOTE: Svelte ignores the generic type in an arrow function
              `export function validator<T>(options: ValidatorFactoryOptions) {
  return createFormValidator<T>({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });
}`
            : `/**
 * @template T
 * @param {import("${formPackage.name}").ValidatorFactoryOptions} options
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
          source: isInternalValidator(validatorWithSuffix)
            ? internalValidatorSubPath(validatorWithSuffix)
            : externalValidatorPackage(validatorWithSuffix).name,
        });
      }
    }),
  );
}
