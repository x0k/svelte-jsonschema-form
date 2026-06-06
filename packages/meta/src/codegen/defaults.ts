import { transforms } from "@sveltejs/sv-utils";

import {
  formCoreSubpath,
  formIdBuilderSubPath,
  formMergerSubPath,
  formPackage,
  formResolverSubPath,
  formTranslationSubPath,
  formUtilSubPath,
  type Resolver,
} from "../form.ts";
import {
  isThemeExtension,
  themeExtensionOrigin,
  themePackage,
  toTheme,
  type ToTheme,
} from "../themes.ts";
import { sveltekitPackage, svelteKitRfSubPath } from "../sveltekit.ts";
import { extraFields, extraFieldSubPath } from "../fields.ts";
import {
  themeExtraWidgets,
  themeExtraWidgetSubPath,
  type ExtraWidgetFileNames,
} from "../widgets.ts";
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
  type CodegenThemeOrSubTheme,
  type CodegenValidator,
  type ConditionalPrinter,
  type CodegenSvelteKitIntegration,
} from "./model.ts";
import { isRecordEmpty } from "@sjsf/form/lib/object";
import { createReExport, getTopLevelFunction } from "./lib.ts";

export interface MergerOptions {
  allOf: "populateDefaults" | "skipDefaults";
  arrayMinItems: {
    populate: "all" | "never" | "requiredOnly";
    mergeExtraDefaults: boolean;
  };
  constAsDefaults: "always" | "skipOneOf" | "never";
  emptyObjectFields:
    | "populateAllDefaults"
    | "populateRequiredDefaults"
    | "skipEmptyDefaults"
    | "skipDefaults";
  mergeDefaultsIntoFormData:
    | "useFormDataIfPresent"
    | "useDefaultIfFormDataUndefined";
}

export interface DefaultsOptions<T extends CodegenThemeOrSubTheme> {
  themeOrSubTheme: T;
  validatorWithSuffix: CodegenValidator;
  icons: CodegenIconSet;
  resolver: Resolver | "inline";
  sveltekit: CodegenSvelteKitIntegration;
  widgets: Iterable<ExtraWidgetFileNames[ToTheme<T>]>;
  isTs: boolean;
  ts: ConditionalPrinter;
  merger: Partial<MergerOptions>;
  focusOnFirstError: boolean;
  uiOptionsRegistry: Record<string, unknown>;
}

const SVELTE_KIT_INTEGRATION_ID_BUILDERS: Record<
  CodegenSvelteKitIntegration,
  string
> = {
  no: formIdBuilderSubPath("modern"),
  formActions: sveltekitPackage.name,
  remoteFunctions: svelteKitRfSubPath(),
};

const LINK_COMMENT =
  "// https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/";

export function createDefaults<T extends CodegenThemeOrSubTheme>({
  themeOrSubTheme,
  validatorWithSuffix,
  icons,
  resolver,
  sveltekit,
  widgets,
  isTs,
  ts,
  merger,
  focusOnFirstError,
  uiOptionsRegistry,
}: DefaultsOptions<T>) {
  return transforms.script(({ ast, comments, js }) => {
    const isAjv = validatorWithSuffix === "ajv8";

    if (isAjv && isTs) {
      js.imports.addNamed(ast, {
        from: formPackage.name,
        imports: ["ValidatorFactoryOptions"],
        isType: true,
      });
    }

    if (resolver === "inline") {
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
        const extraFieldImports = Array.from(
          extraFields({ wrappedFields: false }),
          (f) => `// import "${extraFieldSubPath(f, true)}";`,
        );
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
    } else {
      const resolverExport = createReExport(ast, {
        name: "resolver",
        source: formResolverSubPath(resolver),
      });
      for (const f of extraFields({ wrappedFields: false })) {
        comments.add(resolverExport, {
          type: "Line",
          value: ` import "${extraFieldSubPath(f, true)}";`,
        });
      }
      comments.add(resolverExport, {
        type: "Line",
        value: LINK_COMMENT.slice(2),
      });
    }

    createReExport(ast, {
      name: "translation",
      source: formTranslationSubPath("en"),
    });
    if (!isRecordEmpty(merger)) {
      js.imports.addNamed(ast, {
        imports: ["createFormMerger"],
        from: formMergerSubPath("modern"),
      });

      const fields: string[] = [];
      if (merger.allOf !== undefined) {
        fields.push(`allOf: "${merger.allOf}"`);
      }
      if (merger.arrayMinItems !== undefined) {
        const am: string[] = [];
        if (merger.arrayMinItems.populate !== undefined) {
          am.push(`populate: "${merger.arrayMinItems.populate}"`);
        }
        if (merger.arrayMinItems.mergeExtraDefaults !== undefined) {
          am.push(
            `mergeExtraDefaults: ${merger.arrayMinItems.mergeExtraDefaults}`,
          );
        }
        fields.push(`arrayMinItems: { ${am.join(", ")} }`);
      }
      if (merger.constAsDefaults !== undefined) {
        fields.push(`constAsDefaults: "${merger.constAsDefaults}"`);
      }
      if (merger.emptyObjectFields !== undefined) {
        fields.push(`emptyObjectFields: "${merger.emptyObjectFields}"`);
      }
      if (merger.mergeDefaultsIntoFormData !== undefined) {
        fields.push(
          `mergeDefaultsIntoFormData: "${merger.mergeDefaultsIntoFormData}"`,
        );
      }

      js.common.appendFromString(ast, {
        code: `export function merger(options) {
  return createFormMerger({
    ...options,
    ${fields.join(",\n    ")},
  });
}`,
        comments,
      });
    } else {
      createReExport(ast, {
        name: "merger",
        imported: "createFormMerger",
        source: formMergerSubPath("modern"),
      });
    }
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
    const activeWidgets = new Set<ExtraWidgetFileNames[ToTheme<T>]>(widgets);
    if (isThemeExtension(theme)) {
      // TODO: Remove this type cast
      const originTheme = themeExtensionOrigin(theme) as ToTheme<T>;
      for (const w of themeExtraWidgets(originTheme)) {
        if (activeWidgets.has(w)) {
          js.imports.addEmpty(ast, {
            from: themeExtraWidgetSubPath(originTheme, w, true),
          });
        } else {
          comments.add(themeNode, {
            type: "Line",
            value: ` import "${themeExtraWidgetSubPath(originTheme, w, true)}";`,
          });
        }
      }
    }
    for (const w of themeExtraWidgets(theme)) {
      if (activeWidgets.has(w)) {
        js.imports.addEmpty(ast, {
          from: themeExtraWidgetSubPath(theme, w, true),
        });
      } else {
        comments.add(themeNode, {
          type: "Line",
          value: ` import "${themeExtraWidgetSubPath(theme, w, true)}";`,
        });
      }
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

    if (focusOnFirstError) {
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

    if (!isRecordEmpty(uiOptionsRegistry)) {
      const entries = Object.entries(uiOptionsRegistry)
        .map(([key, value]) => `${key}: ${value}`)
        .join(",\n  ");
      js.common.appendFromString(ast, {
        code: `export const uiOptionsRegistry = {\n  ${entries},\n};`,
        comments,
      });
    }
  });
}
