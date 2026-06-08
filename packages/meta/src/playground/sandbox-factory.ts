import { extraPackage, type AbstractPackage } from "../package.ts";
import {
  type ThemeExtension,
  codegemIsJsonSchemaValidator,
} from "../codegen/index.ts";
import {
  createComposer,
  type CodeTransformer,
  type ComposerOptions,
} from "../composer/index.ts";
import type { FormState } from "./form-state.ts";
import { isEndsWith2020, without2020Suffix } from "./model.ts";

export interface CustomComponentSources {
  markdownDescription: string;
  transparentLayout: string;
}

export interface SandboxFiles {
  name: string;
  files: Record<string, string>;
}

function getChangedMergerOptionsCount(
  options: Pick<
    FormState,
    | "arrayMinItemsPopulate"
    | "arrayMinItemsMergeExtraDefaults"
    | "allOf"
    | "constAsDefault"
    | "emptyObjectFields"
    | "mergeDefaultsIntoFormData"
  >,
): number {
  let count = 0;
  if (options.arrayMinItemsPopulate !== "all") count++;
  if (options.arrayMinItemsMergeExtraDefaults !== false) count++;
  if (options.allOf !== "skipDefaults") count++;
  if (options.constAsDefault !== "always") count++;
  if (options.emptyObjectFields !== "populateAllDefaults") count++;
  if (options.mergeDefaultsIntoFormData !== "useFormDataIfPresent") count++;
  return count;
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

export function createSandboxFiles(
  formState: FormState,
  sources: CustomComponentSources,
): SandboxFiles {
  const { theme, validator } = formState;
  const uiSchemaStr = JSON.stringify(formState.uiSchema, null, 2);
  const {
    usesTransparentLayout,
    usesMarkdownDescription,
    usesStringEnumMapper,
    usesCustomComponents,
  } = detectCustomComponents(uiSchemaStr);

  const hasCustomMergerOptions = getChangedMergerOptionsCount(formState) !== 0;
  const omitExtraData =
    formState.omitExtraData &&
    codegemIsJsonSchemaValidator({ name: without2020Suffix(validator) } as any);

  const moduleAugmentation: NonNullable<
    ComposerOptions<typeof theme>["moduleAugmentation"]
  > = {};
  if (usesCustomComponents) {
    moduleAugmentation.componentBindings = {};
    moduleAugmentation.componentProps = {};
    if (usesMarkdownDescription) {
      moduleAugmentation.componentProps.markdownDescription = "description";
      moduleAugmentation.componentBindings.markdownDescription = '""';
    }
    if (usesTransparentLayout) {
      moduleAugmentation.componentProps.transparentLayout = "layout";
      moduleAugmentation.componentBindings.transparentLayout = '""';
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
        sources.markdownDescription;
      extraDependencies.push(extraPackage("svelteExmarkdown"));
    }
    if (usesTransparentLayout) {
      barrel.push(
        `export { default as transparentLayout } from "./transparent-layout.svelte";`,
      );
      extraFiles["src/lib/custom-components/transparent-layout.svelte"] =
        sources.transparentLayout;
    }
    extraFiles["src/lib/custom-components/index.ts"] = barrel.join("\n") + "\n";
  }

  const themeExtension: ThemeExtension = [];
  if (usesMarkdownDescription) {
    themeExtension.push({
      imports: ["markdownDescription"],
      from: "$lib/custom-components",
    });
  }
  if (usesTransparentLayout) {
    themeExtension.push({
      imports: ["transparentLayout"],
      from: "$lib/custom-components",
    });
  }

  const codeTransformers: CodeTransformer[] = [];
  const files = createComposer({
    name: "Sandbox",
    language: "ts",
    themeOrSubTheme: theme,
    icons: formState.icons,
    validator: {
      precompiled: false,
      name: without2020Suffix(validator),
      draft2020: isEndsWith2020(validator),
    },
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
      : {},
    omitExtraData,
    focusOnFirstError: formState.focusOnFirstError,
    disabled: formState.disabled,
  });

  return {
    name: "Sandbox",
    files,
  };
}
