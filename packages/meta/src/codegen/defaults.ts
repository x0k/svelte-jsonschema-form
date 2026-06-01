import { transforms } from "@sveltejs/sv-utils";

import {
  formCoreSubpath,
  formIdBuilderSubPath,
  formMergerSubPath,
  formPackage,
  formTranslationSubPath,
  formUtilSubPath,
} from "../form.ts";
import {
  isThemeExtension,
  themeExtensionOrigin,
  themePackage,
  toTheme,
  type ThemeOrSubTheme,
} from "../themes.ts";
import { sveltekitPackage, svelteKitRfSubPath } from "../sveltekit.ts";
import { extraFields, extraFieldSubPath } from "../fields.ts";
import { themeExtraWidgets, themeExtraWidgetSubPath } from "../widgets.ts";
import { iconSetPackage } from "../icons.ts";
import {
  externalValidatorPackage,
  internalValidatorSubPath,
  isInternalValidator,
  isJsonSchemaValidator,
} from "../validators.ts";

import {
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
  type CodegenIconSet,
  type CodegenValidator,
  type ConditionalPrinter,
  type SvelteKitIntegration,
} from "./model.ts";
import { createReExport, getTopLevelFunction } from "./lib.ts";

export interface DefaultsOptions {
  themeOrSubTheme: ThemeOrSubTheme;
  validatorWithSuffix: CodegenValidator;
  icons: CodegenIconSet;
  // resolver: Resolver;
  sveltekit: SvelteKitIntegration;
  isTs: boolean;
  ts: ConditionalPrinter;
}

const SVELTE_KIT_INTEGRATION_ID_BUILDERS: Record<SvelteKitIntegration, string> =
  {
    no: formIdBuilderSubPath("modern"),
    formActions: sveltekitPackage.name,
    remoteFunctions: svelteKitRfSubPath(),
  };

const LINK_COMMENT =
  "// https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/";

export function createDefaults({
  themeOrSubTheme,
  validatorWithSuffix,
  icons,
  sveltekit,
  isTs,
  ts,
}: DefaultsOptions) {
  const extraFieldImports: string[] = [];
  for (const f of extraFields({ wrappedFields: false })) {
    extraFieldImports.push(`// import "${extraFieldSubPath(f, true)}";`);
  }
  return transforms.script(({ ast, comments, js }) => {
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
      const resolverCode = `${extraFieldImports.join("\n")}\n${LINK_COMMENT}\n${ts(
        `export function resolver<T>(_ctx: FormState<T>): ResolveFieldType {`,
        `/**
 * @template T
 * @param {import("@sjsf/form").FormState<T>} ctx
 * @returns {import("@sjsf/form").ResolveFieldType}
 */
export function resolver(_ctx) {`,
      )}
  return ({ schema }) => {
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
      source: SVELTE_KIT_INTEGRATION_ID_BUILDERS[sveltekit],
    });

    const theme = toTheme(themeOrSubTheme);
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

    if (icons !== "none") {
      createReExport(ast, {
        name: "icons",
        source: iconSetPackage(icons).name,
      });
    }

    if (withoutPrecompiledSuffix(validatorWithSuffix) === "hyperjump") {
      js.imports.addEmpty(ast, {
        from: "@hyperjump/json-schema/formats-lite",
      });
      js.imports.addEmpty(ast, { from: "@hyperjump/json-schema/draft-07" });
    }

    js.imports.addNamed(ast, {
      imports: ["createFocusOnFirstError"],
      from: formUtilSubPath("focus-on-first-error"),
    });
    const onSubmitErrorExpression = js.common.parseExpression(
      "createFocusOnFirstError()",
    );
    const onSubmitErrorDeclaration = js.variables.declaration(ast, {
      kind: "const",
      name: "onSubmitError",
      value: onSubmitErrorExpression,
    });

    js.exports.createNamed(ast, {
      name: "onSubmitError",
      fallback: onSubmitErrorDeclaration,
    });

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
  });
}
