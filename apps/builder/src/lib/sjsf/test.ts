import type {
  SchemaArrayValue
} from "@sjsf/form/core";
import type {
  FieldCommonProps,
  ComponentDefinition
} from "@sjsf/form";
import type {
  WidgetCommonProps
} from "@sjsf/form/fields/widgets";

import { extendByRecord } from "@sjsf/form/lib/resolver";
import { cast } from "@sjsf/form/lib/component";

export { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra-fields/file-include";
import filesField from "@sjsf/form/fields/extra-fields/files.svelte"

function assertStrings(
  arr: SchemaArrayValue | undefined
): asserts arr is string[] | undefined {
  if (
    arr !== undefined &&
    arr.find((item) => {
      return item !== undefined && typeof item !== "string";
    })
  ) {
    throw new TypeError("expected array of strings");
  }
}

const filesFieldWrapper = cast(filesField, {
  value: {
    transform(props) {
      assertStrings(props.value);
      return props.value;
    },
  },
}) satisfied ComponentDefinition<"arrayField">;

declare module "@sjsf/form" {
  interface ComponentProps {
    filesFieldWrapper: FieldCommonProps<SchemaArrayValue>;
  }
  interface ComponentBindings {
    filesFieldWrapper: "value";
  }
}

import { theme as base } from "@sjsf/skeleton3-theme";
import fileUploadWidget from "@sjsf/skeleton3-theme/extra-widgets/file-upload.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    fileUploadWidget: WidgetCommonProps<FileList> & {
      multiple: boolean;
      loading: boolean;
      processing: boolean;
    };
  }
  interface ComponentBindings {
    fileUploadWidget: "value";
  }
}

export const theme = extendByRecord(base, {
  filesFieldWrapper,
  fileUploadWidget
})

export { translation } from "@sjsf/form/translations/en";

import { createFormValidator } from "@sjsf/ajv8-validator";

export const validator = createFormValidator();