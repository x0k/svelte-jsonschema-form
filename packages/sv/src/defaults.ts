import type { BaseNode } from "estree";
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
  extraFields,
  extraFieldSubPath,
  themeExtraWidgets,
  themeExtraWidgetSubPath,
  isThemeExtension,
  themeExtensionOrigin,
  formCoreSubpath,
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

      const appendComment = (node: BaseNode, content: string) =>
        comments.add(
          node,
          {
            type: "Line",
            value: content,
          },
          { position: "trailing" },
        );

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
          `// https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/\n` +
          (isTs
            ? `function resolver<T>(_ctx: FormState<T>): ResolveFieldType {`
            : `/**
 * @template T
 * @param {import("@sjsf/form").FormState<T>} ctx
 * @returns {import("@sjsf/form").ResolveFieldType}
 */
function resolver(_ctx) {`) +
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
}\n${extraFieldImports.join("\n")}\nexport { resolver };`;
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
      appendComment(themeNode, "\n");
      if (isThemeExtension(theme)) {
        const originTheme = themeExtensionOrigin(theme);
        for (const w of themeExtraWidgets(originTheme)) {
          appendComment(
            themeNode,
            ` import "${themeExtraWidgetSubPath(originTheme, w, true)}";\n`,
          );
        }
      }
      for (const w of themeExtraWidgets(theme)) {
        appendComment(
          themeNode,
          ` import "${themeExtraWidgetSubPath(theme, w, true)}";\n`,
        );
      }

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
