import {
  AFTER_CHANGED,
  AFTER_SUBMITTED,
  AFTER_TOUCHED,
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
} from "@sjsf/form";
import {
  extraPackage,
  formMergerSubPath,
  formPackage,
  isJsonSchemaValidator,
} from "meta";
import type { AbstractPackage, Validator } from "meta";
import type { FormState } from "meta/playground";
import type { Layer } from "meta/composer";

import { getChangedMergerOptionsCount } from "./merger-options";
import markdownDescriptionSource from "./custom-form-components/markdown-description.svelte?raw";
import transparentLayoutSource from "./custom-form-components/transparent-layout.svelte?raw";

const FIELD_VALIDATION_FLAGS = {
  ON_INPUT,
  ON_CHANGE,
  ON_BLUR,
  ON_ARRAY_CHANGE,
  ON_OBJECT_CHANGE,
  AFTER_CHANGED,
  AFTER_SUBMITTED,
  AFTER_TOUCHED,
};

export type PlaygroundLayerOptions = Omit<FormState, "validator"> & {
  validator: Validator;
};

export function createPlaygroundLayer({
  schema,
  uiSchema,
  initialValue,
  disabled,
  fieldsValidationMode,
  html5Validation,
  focusOnFirstError,
  omitExtraData,
  validator,
  arrayMinItemsPopulate,
  arrayMinItemsMergeExtraDefaults,
  allOf,
  constAsDefault,
  emptyObjectFields,
  mergeDefaultsIntoFormData,
}: PlaygroundLayerOptions) {
  const uiSchemaStr = JSON.stringify(uiSchema, null, 2);
  const usesTransparentLayout = uiSchemaStr.includes('"transparentLayout"');
  const usesMarkdownDescription = uiSchemaStr.includes('"markdownDescription"');
  const usesCustomComponents = usesTransparentLayout || usesMarkdownDescription;
  const usesStringEnumMapper = uiSchemaStr.includes(
    '"registry:stringEnumValueMapper"',
  );
  const needsAugmentation = usesCustomComponents || usesStringEnumMapper;
  const hasCustomMergerOptions =
    getChangedMergerOptionsCount({
      arrayMinItemsPopulate,
      arrayMinItemsMergeExtraDefaults,
      allOf,
      constAsDefault,
      emptyObjectFields,
      mergeDefaultsIntoFormData,
    }) !== 0;
  const needsOmitExtraData = omitExtraData && isJsonSchemaValidator(validator);

  const moduleScript = needsAugmentation
    ? buildModuleAugmentation({
        usesCustomComponents,
        usesMarkdownDescription,
        usesTransparentLayout,
        usesStringEnumMapper,
      })
    : "";

  const instanceImports: string[] = [
    `import { createForm, BasicForm, type Schema, type UiSchemaRoot } from "${formPackage.name}";`,
    `import * as defaults from "$lib/form-defaults";`,
  ];
  if (usesCustomComponents) {
    instanceImports.push(
      `import { extendByRecord } from "${formPackage.name}/lib/resolver";`,
      `import { markdownDescription, transparentLayout } from "$lib/custom-components";`,
    );
  }
  if (usesStringEnumMapper) {
    instanceImports.push(
      `import { StringEnumValueMapperBuilder } from "${formPackage.name}/options.svelte";`,
    );
  }
  if (hasCustomMergerOptions) {
    instanceImports.push(
      `import { createFormMerger } from "${formMergerSubPath("modern")}";`,
    );
  }
  if (focusOnFirstError) {
    instanceImports.push(
      `import { createFocusOnFirstError } from "${formPackage.name}/focus-on-first-error";`,
    );
  }
  if (needsOmitExtraData) {
    instanceImports.push(
      `import { omitExtraData } from "${formPackage.name}/omit-extra-data";`,
    );
  }

  const formOptions: string[] = [
    `...defaults`,
    `schema`,
    `uiSchema`,
    ...(initialValue !== undefined
      ? [`initialValue: ${JSON.stringify(initialValue)}`]
      : []),
    `disabled: ${disabled}`,
  ];
  if (fieldsValidationMode) {
    const flags = Object.entries(FIELD_VALIDATION_FLAGS)
      .filter(([, bit]) => bit & fieldsValidationMode)
      .map(([name]) => name);
    instanceImports.push(
      `import { ${flags.join(", ")} } from "${formPackage.name}";`,
    );
    formOptions.push(`fieldsValidationMode: ${flags.join(" | ")}`);
  }
  if (usesCustomComponents) {
    formOptions.push(
      `theme: extendByRecord(defaults.theme, {${[
        usesMarkdownDescription && "markdownDescription",
        usesTransparentLayout && "transparentLayout",
      ]
        .filter(Boolean)
        .join(", ")}})`,
    );
  }
  if (hasCustomMergerOptions) {
    formOptions.push(`merger: (options) => createFormMerger({
      ...options,
      allOf: "${allOf}",
      arrayMinItems: { populate: "${arrayMinItemsPopulate}", mergeExtraDefaults: ${arrayMinItemsMergeExtraDefaults} },
      constAsDefaults: "${constAsDefault}",
      emptyObjectFields: "${emptyObjectFields}",
      mergeDefaultsIntoFormData: "${mergeDefaultsIntoFormData}",
    })`);
  }
  if (needsOmitExtraData) {
    formOptions.push(`validator: (options) => {
      const v = defaults.validator(options);
      return {
        ...v,
        validateFormValue(rootSchema, formValue) {
          return v.validateFormValue(rootSchema, omitExtraData(v, options.merger(), options.schema, formValue));
        },
      };
    }`);
  }
  formOptions.push(`onSubmit: console.log`);
  if (focusOnFirstError) {
    formOptions.push(`onSubmitError: createFocusOnFirstError()`);
  }
  if (usesStringEnumMapper) {
    formOptions.push(`uiOptionsRegistry: {
      stringEnumValueMapper: () => new StringEnumValueMapperBuilder(),
    }`);
  }

  const pageSvelte = `${moduleScript}<script lang="ts">
  ${instanceImports.join("\n  ")}

  const schema = ${JSON.stringify(schema, null, 2)} as const satisfies Schema;
  const uiSchema = ${uiSchemaStr} as UiSchemaRoot;

  const form = createForm({
    ${formOptions.join(",\n    ")},
  });
<\/script>

<BasicForm {form}${html5Validation ? "" : " novalidate"} />`;

  const files: Record<string, string> = {
    "src/routes/+page.svelte": pageSvelte,
  };
  const dependencies: AbstractPackage[] = [];
  if (usesCustomComponents) {
    const barrel: string[] = [];
    if (usesMarkdownDescription) {
      barrel.push(
        `export { default as markdownDescription } from "./markdown-description.svelte";`,
      );
      files["src/lib/custom-components/markdown-description.svelte"] =
        markdownDescriptionSource;
      dependencies.push(extraPackage("svelteExmarkdown"));
    }
    if (usesTransparentLayout) {
      barrel.push(
        `export { default as transparentLayout } from "./transparent-layout.svelte";`,
      );
      files["src/lib/custom-components/transparent-layout.svelte"] =
        transparentLayoutSource;
    }
    files["src/lib/custom-components/index.ts"] = barrel.join("\n") + "\n";
  }

  return {
    package: {
      name: "playground",
      dependencies,
    },
    files,
  } satisfies Layer<any>;
}

function buildModuleAugmentation(used: {
  usesCustomComponents: boolean;
  usesMarkdownDescription: boolean;
  usesTransparentLayout: boolean;
  usesStringEnumMapper: boolean;
}) {
  const moduleImports: string[] = [];
  const augmentations: string[] = [];

  if (used.usesCustomComponents) {
    moduleImports.push(
      `import type { ComponentProps } from "${formPackage.name}";`,
    );
    const componentProps: string[] = [];
    const componentBindings: string[] = [];
    if (used.usesMarkdownDescription) {
      componentProps.push(
        `markdownDescription: ComponentProps["description"];`,
      );
      componentBindings.push(`markdownDescription: "";`);
    }
    if (used.usesTransparentLayout) {
      componentProps.push(`transparentLayout: ComponentProps["layout"];`);
      componentBindings.push(`transparentLayout: "";`);
    }
    augmentations.push(`    interface ComponentProps {
      ${componentProps.join("\n      ")}
    }
    interface ComponentBindings {
      ${componentBindings.join("\n      ")}
    }`);
  }
  if (used.usesStringEnumMapper) {
    moduleImports.push(
      `import type { EnumValueMapperBuilder } from "${formPackage.name}/options.svelte";`,
    );
    augmentations.push(`    interface UiOptionsRegistry {
      stringEnumValueMapper: () => EnumValueMapperBuilder;
    }`);
  }

  return `<script lang="ts" module>
  ${moduleImports.join("\n  ")}
  declare module "${formPackage.name}" {
${augmentations.join("\n")}
  }
<\/script>

`;
}
