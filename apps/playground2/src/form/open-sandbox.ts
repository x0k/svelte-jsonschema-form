import {
  extraPackage,
  isJsonSchemaValidator,
  type AbstractPackage,
} from "meta";
import { withoutDraft2020Suffix } from "meta/codegen";
import {
  createComposer,
  type CodeTransformer,
  type ComposerOptions,
} from "meta/composer";
import { sandboxOpen, type SandboxPlatform } from "meta/sandbox";
import { type FormState } from "meta/playground";

import { getChangedMergerOptionsCount } from "./merger-options";
import markdownDescriptionSource from "./custom-form-components/markdown-description.svelte?raw";
import transparentLayoutSource from "./custom-form-components/transparent-layout.svelte?raw";

export interface SandboxOptions {
  formState: FormState;
  platform: SandboxPlatform;
}

function detectCustomComponents(uiSchemaStr: string) {
  const usesTransparentLayout = uiSchemaStr.includes('"transparentLayout"');
  const usesMarkdownDescription = uiSchemaStr.includes('"markdownDescription"');
  const usesStringEnumMapper = uiSchemaStr.includes(
    '"registry:stringEnumValueMapper"',
  );
  return {
    usesTransparentLayout,
    usesMarkdownDescription,
    usesStringEnumMapper,
    usesCustomComponents: usesTransparentLayout || usesMarkdownDescription,
  };
}

export async function openSandbox({ formState, platform }: SandboxOptions) {
  const { theme, validator } = formState;
  const uiSchemaStr = JSON.stringify(formState.uiSchema, null, 2);
  const {
    usesTransparentLayout,
    usesMarkdownDescription,
    usesStringEnumMapper,
    usesCustomComponents,
  } = detectCustomComponents(uiSchemaStr);

  const hasCustomMergerOptions = getChangedMergerOptionsCount(formState) !== 0;
  const baseValidator = withoutDraft2020Suffix(validator);
  const needsOmitExtraData =
    formState.omitExtraData && isJsonSchemaValidator(baseValidator);

  const moduleAugmentation: NonNullable<
    ComposerOptions<typeof theme>["moduleAugmentation"]
  > = {};
  if (usesCustomComponents) {
    moduleAugmentation.componentBindings = {};
    moduleAugmentation.componentProps = {};
    if (usesMarkdownDescription) {
      moduleAugmentation.componentProps.markdownDescription = "description";
      moduleAugmentation.componentBindings.markdownDescription = "";
    }
    if (usesTransparentLayout) {
      moduleAugmentation.componentProps.transparentLayout = "layout";
      moduleAugmentation.componentBindings.transparentLayout = "";
    }
  }
  if (usesStringEnumMapper) {
    moduleAugmentation.uiOptionsRegistry = {
      stringEnumValueMapper: "EnumValueMapperBuilder",
    };
  }

  const extraFiles: Record<string, string> = {};
  const extraDependencies: AbstractPackage[] = [];
  if (usesCustomComponents) {
    const barrel: string[] = [];
    if (usesMarkdownDescription) {
      barrel.push(
        `export { default as markdownDescription } from "./markdown-description.svelte";`,
      );
      extraFiles["src/lib/custom-components/markdown-description.svelte"] =
        markdownDescriptionSource;
      extraDependencies.push(extraPackage("svelteExmarkdown"));
    }
    if (usesTransparentLayout) {
      barrel.push(
        `export { default as transparentLayout } from "./transparent-layout.svelte";`,
      );
      extraFiles["src/lib/custom-components/transparent-layout.svelte"] =
        transparentLayoutSource;
    }
    extraFiles["src/lib/custom-components/index.ts"] = barrel.join("\n") + "\n";
  }

  const themeExtension:
    | NonNullable<ComposerOptions<typeof theme>["themeExtension"]>
    | undefined = usesCustomComponents
    ? {
        components: [
          ...(usesMarkdownDescription
            ? [{ name: "markdownDescription", from: "$lib/custom-components" }]
            : []),
          ...(usesTransparentLayout
            ? [{ name: "transparentLayout", from: "$lib/custom-components" }]
            : []),
        ],
      }
    : undefined;

  const codeTransformers: CodeTransformer[] = [];
  const files = createComposer({
    name: "Sandbox",
    language: "ts",
    themeOrSubTheme: theme,
    icons: formState.icons,
    validatorWithSuffix: validator,
    sveltekit: "no",
    widgets: [],
    extraFiles,
    extraDependencies,
    codeTransformers,
    modelName: "model",
    schema: formState.schema,
    uiSchema: formState.uiSchema,
    initialValue: formState.initialValue,
    fieldsValidationMode: formState.fieldsValidationMode,
    merger: {},
    uiOptionsRegistry: usesStringEnumMapper
      ? {
          stringEnumValueMapper: {
            kind: "StringEnumValueMapperBuilder",
          },
        }
      : {},
    moduleAugmentation,
    themeExtension,
    mergerConfig: hasCustomMergerOptions
      ? {
          allOf: formState.allOf,
          arrayMinItems: {
            populate: formState.arrayMinItemsPopulate,
            mergeExtraDefaults: formState.arrayMinItemsMergeExtraDefaults,
          },
          constAsDefaults: formState.constAsDefault,
          emptyObjectFields: formState.emptyObjectFields,
          mergeDefaultsIntoFormData: formState.mergeDefaultsIntoFormData,
        }
      : undefined,
    validatorWrap: needsOmitExtraData ? { kind: "omitExtraData" } : undefined,
    focusOnFirstError: formState.focusOnFirstError,
    disabled: formState.disabled,
  });

  await sandboxOpen({
    name: "Sandbox",
    platform,
    files,
  });
}
