import { cast } from "@sjsf/form/lib/component";
import { extendByRecord } from "@sjsf/form/lib/resolver";
import type { ComponentDefinition, FieldCommonProps } from "@sjsf/form";

export { translation } from "@sjsf/form/translations/en";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import NativeFileField from "@sjsf/form/fields/extra-fields/native-file.svelte";

import { theme as baseTheme } from "@sjsf/shadcn4-theme";
import "@sjsf/shadcn4-theme/extra-widgets/textarea-include";
import "@sjsf/shadcn4-theme/extra-widgets/checkboxes-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-include";
import "@sjsf/shadcn4-theme/extra-widgets/file-include";
import "@sjsf/shadcn4-theme/extra-widgets/date-picker-include";

declare module "@sjsf/form" {
  interface ComponentProps {
    nativeFileFieldWrapper: FieldCommonProps<unknown>;
  }
  interface ComponentBindings {
    nativeFileFieldWrapper: "value";
  }
}

const nativeFileFieldWrapper = cast(NativeFileField, {
  value: {
    transform(props) {
      const v = props.value;
      if (v !== undefined && !(v instanceof File)) {
        throw new Error(
          `expected "File" or "undefined" value, but got ${typeof v}`
        );
      }
      return v;
    },
  },
}) satisfies ComponentDefinition<"unknownField">;

export const theme = extendByRecord(baseTheme, {
  nativeFileFieldWrapper,
});

export { createFormIdBuilder as createIdBuilder } from "@sjsf/form/id-builders/modern";

export { createFormMerger as createMerger } from "@sjsf/form/mergers/modern";

import type { ValidatorFactoryOptions } from "@sjsf/form";
import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
import addFormats from "ajv-formats";

export const createValidator = (options: ValidatorFactoryOptions) =>
  createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv)),
  });
