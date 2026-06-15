import { transforms, type AstTypes } from "@sveltejs/sv-utils";
import type { DeepPartial } from "@sjsf/form/lib/types";
import { isRecordEmpty } from "@sjsf/form/lib/object";

import {
  formCoreSubpath,
  formIdBuilderSubPath,
  formMergerSubPath,
  formPackage,
  formResolverSubPath,
  formTranslationSubPath,
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
import {
  extraFields,
  extraFieldSubPath,
  type ExtraFieldFileName,
} from "../fields.ts";
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

import { createDraft2020ValidatorExport } from "./validator.ts";
import type {
  CodegenIconSet,
  CodegenThemeOrSubTheme,
  CodegenValidator,
  ConditionalPrinter,
  CodegenSvelteKitIntegration,
} from "./model.ts";
import {
  createReExport,
  getTopLevelFunction,
  type NamedImportOptions,
} from "./lib.ts";

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

export type ThemeExtension = NamedImportOptions[];

export interface ModuleAugmentation {
  componentProps: Record<string, string>;
  componentBindings: Record<string, string>;
  uiOptionsRegistry: Record<string, string>;
}

export type UiOptionsRegistryEntry =
  | { kind: "StringEnumValueMapperBuilder" }
  | { kind: "IdEnumValueMapperBuilder" };

export interface DefaultsOptions<T extends CodegenThemeOrSubTheme> {
  themeOrSubTheme: T;
  validator: CodegenValidator;
  icons: CodegenIconSet;
  resolver: Resolver | "inline";
  sveltekit: CodegenSvelteKitIntegration;
  widgets: Iterable<ExtraWidgetFileNames[ToTheme<T>]>;
  fields: Iterable<ExtraFieldFileName>;
  isTs: boolean;
  ts: ConditionalPrinter;
  js: ConditionalPrinter;
  merger: DeepPartial<MergerOptions>;
  focusOnFirstError: boolean;
  themeExtension: ThemeExtension;
  moduleAugmentation: Partial<ModuleAugmentation>;
  uiOptionsRegistry: Record<string, UiOptionsRegistryEntry>;
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
  validator,
  icons,
  resolver,
  sveltekit,
  widgets,
  fields,
  isTs,
  ts,
  js,
  merger,
  focusOnFirstError,
  themeExtension,
  moduleAugmentation,
  uiOptionsRegistry,
}: DefaultsOptions<T>) {
  return transforms.script(({ ast, comments, js: jsApi }) => {
    if (resolver === "inline") {
      if (!getTopLevelFunction(ast, "resolver")) {
        jsApi.imports.addNamed(ast, {
          imports: ["getSimpleSchemaType", "isFixedItems"],
          from: formCoreSubpath,
        });
        if (isTs) {
          jsApi.imports.addNamed(ast, {
            imports: ["FormState", "ResolveFieldType"],
            from: formPackage.name,
            isType: true,
          });
        }
        const extraFieldImports = Array.from(
          extraFields({ wrappedFields: false }),
          (f) => `// import "${extraFieldSubPath(f, true)}";`
        );
        const resolverCode = `${extraFieldImports.join("\n")}\n${LINK_COMMENT}\n${ts(
          `export function resolver<T>(_ctx: FormState<T>): ResolveFieldType {`,
          `/**
 * @template T
 * @param {import("@sjsf/form").FormState<T>} ctx
 * @returns {import("@sjsf/form").ResolveFieldType}
 */
export function resolver(_ctx) {`
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
        jsApi.common.appendFromString(ast, {
          code: resolverCode,
          comments,
        });
      }
    } else {
      const resolverExport = createReExport(ast, {
        name: "resolver",
        source: formResolverSubPath(resolver),
      });
      const activeFields = new Set<ExtraFieldFileName>(fields);
      for (const f of extraFields({ wrappedFields: false })) {
        if (activeFields.has(f)) {
          jsApi.imports.addEmpty(ast, {
            from: extraFieldSubPath(f, true),
          });
        } else {
          comments.add(resolverExport, {
            type: "Line",
            value: ` import "${extraFieldSubPath(f, true)}";`,
          });
        }
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
      jsApi.imports.addNamed(ast, {
        imports: ["createFormMerger"],
        from: formMergerSubPath("modern"),
      });
      if (isTs) {
        jsApi.imports.addNamed(ast, {
          imports: ["FormMergerOptions"],
          from: formMergerSubPath("modern"),
          isType: true,
        });
      }

      const fields = JSON.stringify(merger).slice(1, -1);

      jsApi.common.appendFromString(ast, {
        code: `${js(`/**
 * @param {import("${formMergerSubPath("modern")}").FormMergerOptions} options
 * @returns {import("${formPackage.name}").FormMerger}
 */\n`)}export function merger(options${ts(": FormMergerOptions")}) {
  return createFormMerger({
    ...options,
    ${fields},
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
    const themePackageName = themePackage(theme).name;
    const activeWidgets = new Set<ExtraWidgetFileNames[ToTheme<T>]>(widgets);
    let themeNode: AstTypes.ExportNamedDeclaration;
    if (themeExtension.length > 0) {
      jsApi.imports.addNamed(ast, {
        imports: ["extendByRecord"],
        from: "@sjsf/form/lib/resolver",
      });
      jsApi.imports.addNamed(ast, {
        from: themePackageName,
        imports: { theme: "base" },
      });
      for (const c of themeExtension) {
        jsApi.imports.addNamed(ast, c);
      }
      const names = themeExtension
        .flatMap((c) =>
          Array.isArray(c.imports) ? c.imports : Object.values(c.imports)
        )
        .join(", ");
      const themeExpression = jsApi.common.parseExpression(
        `extendByRecord(base, { ${names} })`
      );
      const themeDeclaration = jsApi.variables.declaration(ast, {
        kind: "const",
        name: "theme",
        value: themeExpression,
      });
      themeNode = jsApi.exports.createNamed(ast, {
        name: "theme",
        fallback: themeDeclaration,
      });
    } else {
      themeNode = createReExport(ast, {
        name: "theme",
        source: themePackageName,
      });
    }
    if (isThemeExtension(theme)) {
      const originTheme = themeExtensionOrigin(theme) as ToTheme<T>;
      for (const w of themeExtraWidgets(originTheme)) {
        if (activeWidgets.has(w)) {
          jsApi.imports.addEmpty(ast, {
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
        jsApi.imports.addEmpty(ast, {
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

    if (validator.name === "hyperjump") {
      jsApi.imports.addEmpty(ast, {
        from: "@hyperjump/json-schema/formats-lite",
      });
      jsApi.imports.addEmpty(ast, { from: "@hyperjump/json-schema/draft-07" });
    }

    if (focusOnFirstError) {
      jsApi.imports.addNamed(ast, {
        imports: ["createFocusOnFirstError"],
        from: "@sjsf/form/focus-on-first-error",
      });
      const onSubmitErrorExpression = jsApi.common.parseExpression(
        "createFocusOnFirstError()"
      );
      const onSubmitErrorDeclaration = jsApi.variables.declaration(ast, {
        kind: "const",
        name: "onSubmitError",
        value: onSubmitErrorExpression,
      });
      jsApi.exports.createNamed(ast, {
        name: "onSubmitError",
        fallback: onSubmitErrorDeclaration,
      });
    }

    if (!isRecordEmpty(moduleAugmentation)) {
      const typeNames: string[] = [];
      const interfaceBlocks: string[] = [];
      if (moduleAugmentation.componentProps !== undefined) {
        typeNames.push("ComponentProps");
        const props = Object.entries(moduleAugmentation.componentProps)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n");
        interfaceBlocks.push(`interface ComponentProps {\n${props}\n}`);
      }
      if (moduleAugmentation.componentBindings !== undefined) {
        typeNames.push("ComponentBindings");
        const props = Object.entries(moduleAugmentation.componentBindings)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n");
        interfaceBlocks.push(`interface ComponentBindings {\n${props}\n}`);
      }
      if (moduleAugmentation.uiOptionsRegistry !== undefined) {
        typeNames.push("UiOptionsRegistry");
        const props = Object.entries(moduleAugmentation.uiOptionsRegistry)
          .map(([key, value]) => `  ${key}: ${value};`)
          .join("\n");
        interfaceBlocks.push(`interface UiOptionsRegistry {\n${props}\n}`);
      }
      if (isTs) {
        jsApi.imports.addNamed(ast, {
          from: formPackage.name,
          imports: typeNames,
          isType: true,
        });
        jsApi.common.appendFromString(ast, {
          code: `declare module "${formPackage.name}" {
  ${interfaceBlocks.join("\n  ")}
}`,
          comments,
        });
      } else {
        jsApi.common.appendFromString(ast, {
          code: `/**
 * @typedef {import("${formPackage.name}").${typeNames.join(
   " & "
 )}} _ModuleAugmentation
 */`,
          comments,
        });
      }
    }

    if (
      getTopLevelFunction(ast, "validator") ||
      validator.precompiled ||
      !(isJsonSchemaValidator(validator.name) || validator.name === "noop")
    ) {
      return;
    }

    if (validator.draft2020) {
      const { imports, code } = createDraft2020ValidatorExport(validator, ts);
      for (const i of imports) {
        if (i.isDefault) {
          if (i.as === undefined) continue;
          jsApi.imports.addDefault(ast, { from: i.from, as: i.as });
        } else {
          jsApi.imports.addNamed(ast, {
            from: i.from,
            imports: i.imports ?? [],
            isType: i.isType,
          });
        }
      }
      jsApi.common.appendFromString(ast, { code, comments });
    } else if (validator.name === "ajv8") {
      if (isTs) {
        jsApi.imports.addNamed(ast, {
          from: formPackage.name,
          imports: ["ValidatorFactoryOptions"],
          isType: true,
        });
      }

      jsApi.imports.addNamed(ast, {
        from: externalValidatorPackage(validator.name).name,
        imports: ["addFormComponents", "createFormValidator"],
      });
      jsApi.imports.addDefault(ast, {
        from: "ajv-formats",
        as: "addFormats",
      });

      jsApi.common.appendFromString(ast, {
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
        source: isInternalValidator(validator.name)
          ? internalValidatorSubPath(validator.name)
          : externalValidatorPackage(validator.name).name,
      });
    }

    if (!isRecordEmpty(uiOptionsRegistry)) {
      const entries: string[] = [];
      const importedClasses = new Set<string>();
      for (const [key, entry] of Object.entries(uiOptionsRegistry)) {
        switch (entry.kind) {
          case "StringEnumValueMapperBuilder":
            importedClasses.add("StringEnumValueMapperBuilder");
            entries.push(`${key}: () => new StringEnumValueMapperBuilder()`);
            break;
          case "IdEnumValueMapperBuilder":
            importedClasses.add("IdEnumValueMapperBuilder");
            entries.push(`${key}: () => new IdEnumValueMapperBuilder()`);
            break;
        }
      }
      for (const importedClass of importedClasses) {
        jsApi.imports.addNamed(ast, {
          from: `${formPackage.name}/options.svelte`,
          imports: [importedClass],
        });
      }
      jsApi.common.appendFromString(ast, {
        code: `export const uiOptionsRegistry = {\n  ${entries.join(",\n  ")},\n};`,
        comments,
      });
    }
  });
}
