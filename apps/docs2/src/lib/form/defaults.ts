import { cast } from "@sjsf/form/lib/component";
import { extendByRecord } from "@sjsf/form/lib/resolver";
import type { ComponentDefinition, FieldCommonProps } from "@sjsf/form";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import NativeFileField from "@sjsf/form/fields/extra-fields/native-file.svelte";

import { theme as basicTheme } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/textarea-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";

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

export const theme = extendByRecord(basicTheme, {
  nativeFileFieldWrapper,
});

export { createFormValidator as createValidator } from "@sjsf/ajv8-validator";

export { createFormMerger as createMerger } from "@sjsf/form/mergers/modern";

export { translation } from "@sjsf/form/translations/en";
