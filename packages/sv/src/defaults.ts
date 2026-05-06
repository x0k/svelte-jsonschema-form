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
  formUtilSubPath,
} from "meta";

import {
  createReExport,
  getTopLevelFunction,
  importsAddNamed,
  transforms,
} from "./sv-utils.js";
import {
  isEndsWithPrecompiled,
  withoutPrecompiledSuffix,
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

const LINK_COMMENT =
  "// https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/";

export function defaultsTs({
  options,
  isTs,
  sv,
  language,
  directory,
  ts,
}: Context) {
  const extraFieldImports: string[] = [];
  for (const f of extraFields({ wrappedFields: false })) {
    extraFieldImports.push(`// import "${extraFieldSubPath(f, true)}";`);
  }

  const transform = transforms.script(({ ast, comments, js }) => {
    const { validatorWithSuffix } = options;
    const isAjv = validatorWithSuffix === "ajv8";

    if (isAjv && isTs) {
      importsAddNamed(ast, {
        from: formPackage.name,
        imports: ["ValidatorFactoryOptions"],
        isType: true,
      });
    }

    if (!getTopLevelFunction(ast, "resolver")) {
      importsAddNamed(ast, {
        imports: ["getSimpleSchemaType", "isFixedItems"],
        from: formCoreSubpath,
      });
      if (isTs) {
        importsAddNamed(ast, {
          imports: ["FormState", "ResolveFieldType"],
          from: formPackage.name,
          isType: true,
        });
      }

      // NOTE: Produces invalid code
      // `${extraFieldImports.join("\n")}\n
      const resolverCode = `${LINK_COMMENT}\n${ts(
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
      importsAddNamed(ast, {
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

  sv.file(`${directory.lib}/sjsf/defaults.${language}`, (content) => {
    const transformed = transform(content);
    console.log("---------");
    console.log(transformed);
    return transformed.replace(
      LINK_COMMENT,
      `${extraFieldImports.join("\n")}\n${LINK_COMMENT}`,
    );
  });
}
