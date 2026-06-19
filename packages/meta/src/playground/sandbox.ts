import {
  isUiSchemaRef,
  type UiSchema,
  type UiSchemaDefinition,
  type UiSchemaRoot,
} from "@sjsf/form";

import {
  type ThemeExtension,
  codegemIsJsonSchemaValidator,
} from "../codegen/index.ts";
import {
  createComposer,
  type CodeTransformer,
  type ComposerOptions,
} from "../composer/index.ts";
import {
  extraFieldNameToFileName,
  type ExtraFieldFileName,
} from "../fields.ts";
import { extraPackage, type AbstractPackage } from "../package.ts";
import { toTheme, type Theme } from "../themes.ts";
import { WIDGETS } from "../widgets.generated.ts";
import { isThemeBaseWidget, type ExtraWidgetFileNames } from "../widgets.ts";
import type { FormState } from "./form-state.ts";
import { normalizeValidator, type PlaygroundTheme } from "./model.ts";
import { parseJsRecord } from "./parse.ts";
import { WIDGET_EXTRA_FIELD } from "./widget-extra-fields.ts";

export interface CustomComponents {
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
  >
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

const UI_SCHEMA_META_KEYS = new Set([
  "ui:options",
  "ui:components",
  "ui:globalOptions",
  "$ref",
]);

function traverseUiSchema(
  def: UiSchemaRoot | undefined,
  visitor: (node: UiSchema) => void
): void {
  if (def === undefined || isUiSchemaRef(def)) {
    return;
  }
  visitor(def);
  for (const key of Object.keys(def)) {
    if (UI_SCHEMA_META_KEYS.has(key)) {
      continue;
    }
    const value = def[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        traverseUiSchema(item, visitor);
      }
    } else {
      traverseUiSchema(value as UiSchemaDefinition, visitor);
    }
  }
}

const WIDGET_EXTRA_FIELD_KEYS = new Set<string>(
  Object.keys(WIDGET_EXTRA_FIELD)
);

function detectCustomComponentsAndFields(
  uiSchema: UiSchemaRoot,
  theme: PlaygroundTheme
): {
  usesTransparentLayout: boolean;
  usesMarkdownDescription: boolean;
  usesStringEnumMapper: boolean;
  extraWidgets: ExtraWidgetFileNames[Theme][];
  extraFields: ExtraFieldFileName[];
} {
  const actualTheme = toTheme(theme as Theme);
  const themeMeta = WIDGETS[actualTheme];

  let usesTransparentLayout = false;
  let usesMarkdownDescription = false;
  let usesStringEnumMapper = false;

  // Build reverse map: widget type name → file name for this theme
  const widgetTypeToFile = new Map<string, string>();
  for (const [file, type] of Object.entries(themeMeta.widgets)) {
    widgetTypeToFile.set(type, file);
  }
  for (const [file, type] of Object.entries(themeMeta.extraWidgets)) {
    widgetTypeToFile.set(type, file);
  }
  const allWidgetTypeNames = new Set(widgetTypeToFile.keys());

  const extraWidgetFileNames = new Set<string>();
  const extraFieldFileNames = new Set<ExtraFieldFileName>();

  traverseUiSchema(uiSchema, (node) => {
    const components = node["ui:components"];
    if (components) {
      for (const value of Object.values(components)) {
        if (typeof value !== "string") continue;
        if (value === "transparentLayout") usesTransparentLayout = true;
        if (value === "markdownDescription") usesMarkdownDescription = true;

        if (
          allWidgetTypeNames.has(value) &&
          !isThemeBaseWidget(actualTheme, value)
        ) {
          const fileName = widgetTypeToFile.get(value);
          if (fileName !== undefined) extraWidgetFileNames.add(fileName);
          if (WIDGET_EXTRA_FIELD_KEYS.has(value)) {
            const extraField =
              WIDGET_EXTRA_FIELD[value as keyof typeof WIDGET_EXTRA_FIELD];
            if (extraField !== undefined) extraFieldFileNames.add(extraField);
          }
        } else {
          const fileName = extraFieldNameToFileName(value);
          if (fileName !== undefined) extraFieldFileNames.add(fileName);
        }
      }
    }

    const options = node["ui:options"];
    if (options?.enumValueMapperBuilder === "registry:stringEnumValueMapper") {
      usesStringEnumMapper = true;
    }
  });

  return {
    usesTransparentLayout,
    usesMarkdownDescription,
    usesStringEnumMapper,
    extraWidgets: [
      ...extraWidgetFileNames,
    ] as ExtraWidgetFileNames[typeof actualTheme][],
    extraFields: [...extraFieldFileNames],
  };
}

export interface SandboxFilesOptions {
  name: string;
  formState: FormState;
  customComponents: CustomComponents;
}

export async function createSandboxFiles({
  name,
  formState,
  customComponents: { markdownDescription, transparentLayout },
}: SandboxFilesOptions) {
  const [schema, uiSchema] = await Promise.all([
    parseJsRecord(formState.schema),
    parseJsRecord(formState.uiSchema),
  ]);
  const {
    usesTransparentLayout,
    usesMarkdownDescription,
    usesStringEnumMapper,
    extraWidgets,
    extraFields,
  } = detectCustomComponentsAndFields(uiSchema, formState.theme);

  const usesCustomComponents = usesTransparentLayout || usesMarkdownDescription;
  const hasCustomMergerOptions = getChangedMergerOptionsCount(formState) !== 0;

  const validator = normalizeValidator(formState.validator);
  const omitExtraData =
    formState.omitExtraData && codegemIsJsonSchemaValidator(validator);

  const moduleAugmentation: NonNullable<
    ComposerOptions<typeof formState.theme>["moduleAugmentation"]
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
        `export { default as markdownDescription } from "./markdown-description.svelte";`
      );
      extraFiles["src/lib/custom-components/markdown-description.svelte"] =
        markdownDescription;
      extraDependencies.push(extraPackage("svelteExmarkdown"));
    }
    if (usesTransparentLayout) {
      barrel.push(
        `export { default as transparentLayout } from "./transparent-layout.svelte";`
      );
      extraFiles["src/lib/custom-components/transparent-layout.svelte"] =
        transparentLayout;
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
  return createComposer({
    name,
    schema,
    uiSchema,
    language: "ts",
    validator,
    themeOrSubTheme: formState.theme,
    icons: formState.icons,
    sveltekit: "no",
    widgets: extraWidgets,
    fields: extraFields,
    extraFiles,
    extraDependencies,
    codeTransformers,
    modelName: "model",
    initialValue: formState.initialValue,
    fieldsValidationMode: formState.fieldsValidationMode,
    merger: hasCustomMergerOptions
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
    uiOptionsRegistry: usesStringEnumMapper
      ? {
          stringEnumValueMapper: {
            kind: "StringEnumValueMapperBuilder",
          },
        }
      : {},
    moduleAugmentation,
    themeExtension,
    omitExtraData,
    focusOnFirstError: formState.focusOnFirstError,
    disabled: formState.disabled,
  });
}
