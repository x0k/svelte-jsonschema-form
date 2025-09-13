import { cast } from "@sjsf/form/lib/component";
import { extendByRecord } from "@sjsf/form/lib/resolver";
import type { SchemaArrayValue } from "@sjsf/form/core";
import type {
  ComponentDefinition,
  FieldCommonProps,
  SchemaValue,
} from "@sjsf/form";
import type { Options, WidgetCommonProps } from "@sjsf/form/fields/widgets";

import "@sjsf/form/fields/extra-fields/boolean-select-include";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import "@sjsf/form/fields/extra-fields/files-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/tags-include";
import FilesField from "@sjsf/form/fields/extra-fields/files.svelte";
import NativeFileField from "@sjsf/form/fields/extra-fields/native-file.svelte";
import NativeFilesField from "@sjsf/form/fields/extra-fields/native-files.svelte";
import TagsField from "@sjsf/form/fields/extra-fields/tags.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    filesFieldWrapper: FieldCommonProps<SchemaArrayValue>;
    nativeFileWrapper: FieldCommonProps<unknown>;
    nativeFilesWrapper: FieldCommonProps<SchemaArrayValue>;
    tagsFieldWrapper: FieldCommonProps<SchemaArrayValue>;
  }
  interface ComponentBinding {
    filesFieldWrapper: "value";
    nativeFileWrapper: "value";
    nativeFilesWrapper: "value";
    tagsFieldWrapper: "value";
  }
}

import { theme as basic } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";
import "@sjsf/basic-theme/extra-widgets/date-picker-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/multi-select-include";
import "@sjsf/basic-theme/extra-widgets/radio-include";
import "@sjsf/basic-theme/extra-widgets/range-include";
import "@sjsf/basic-theme/extra-widgets/textarea-include";

import { theme as daisy5base } from "@sjsf/daisyui5-theme";
import daisy5Styles from "@sjsf/daisyui5-theme/styles.css?raw";
import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include";
import "@sjsf/daisyui5-theme/extra-widgets/checkboxes-include";
import "@sjsf/daisyui5-theme/extra-widgets/file-include";
import "@sjsf/daisyui5-theme/extra-widgets/multi-select-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-buttons-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-include";
import "@sjsf/daisyui5-theme/extra-widgets/range-include";
import "@sjsf/daisyui5-theme/extra-widgets/rating-include";
import "@sjsf/daisyui5-theme/extra-widgets/switch-include";
import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";
import FilterRadioButtons from "@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons.svelte";
import PikadayDatePicker from "@sjsf/daisyui5-theme/extra-widgets/pikaday-date-picker.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    filterRadioButtonsWidget: WidgetCommonProps<SchemaValue> & Options;
    pikadayDatePickerWidget: WidgetCommonProps<string>;
  }
  interface ComponentBinding {
    filterRadioButtonsWidget: "value";
    pikadayDatePickerWidget: "value";
  }
}

const daisy5 = extendByRecord(daisy5base, {
  filterRadioButtonsWidget: FilterRadioButtons,
  pikadayDatePickerWidget: PikadayDatePicker,
});

import { theme as flowbite3 } from "@sjsf/flowbite3-theme";
import flowbite3Styles from "@sjsf/flowbite3-theme/styles.css?inline";
import "@sjsf/flowbite3-theme/extra-widgets/checkboxes-include";
import "@sjsf/flowbite3-theme/extra-widgets/date-picker-include";
import "@sjsf/flowbite3-theme/extra-widgets/file-include";
import "@sjsf/flowbite3-theme/extra-widgets/multi-select-include";
import "@sjsf/flowbite3-theme/extra-widgets/radio-buttons-include";
import "@sjsf/flowbite3-theme/extra-widgets/radio-include";
import "@sjsf/flowbite3-theme/extra-widgets/range-include";
import "@sjsf/flowbite3-theme/extra-widgets/switch-include";
import "@sjsf/flowbite3-theme/extra-widgets/tags-include";
import "@sjsf/flowbite3-theme/extra-widgets/textarea-include";

import { theme as skeleton3base } from "@sjsf/skeleton3-theme";
import skeleton3Styles from "@sjsf/skeleton3-theme/styles.css?inline";
import "@sjsf/skeleton3-theme/extra-widgets/checkboxes-include";
import "@sjsf/skeleton3-theme/extra-widgets/date-picker-include";
import "@sjsf/skeleton3-theme/extra-widgets/file-include";
import "@sjsf/skeleton3-theme/extra-widgets/multi-select-include";
import "@sjsf/skeleton3-theme/extra-widgets/radio-buttons-include";
import "@sjsf/skeleton3-theme/extra-widgets/radio-include";
import "@sjsf/skeleton3-theme/extra-widgets/range-include";
import "@sjsf/skeleton3-theme/extra-widgets/rating-include";
import "@sjsf/skeleton3-theme/extra-widgets/switch-include";
import "@sjsf/skeleton3-theme/extra-widgets/tags-include";
import "@sjsf/skeleton3-theme/extra-widgets/textarea-include";
import FileUpload from "@sjsf/skeleton3-theme/extra-widgets/file-upload.svelte";
import Slider from "@sjsf/skeleton3-theme/extra-widgets/slider.svelte";

declare module "@sjsf/form" {
  interface ComponentProps {
    fileUploadWidget: WidgetCommonProps<FileList> & {
      multiple: boolean;
      loading: boolean;
      processing: boolean;
    };
    sliderWidget: WidgetCommonProps<number>;
  }
  interface ComponentBindings {
    fileUploadWidget: "value";
    sliderWidget: "value";
  }
}

const skeleton3 = extendByRecord(skeleton3base, {
  fileUploadWidget: FileUpload,
  sliderWidget: Slider,
});

import { theme as shadcn4 } from "@sjsf/shadcn4-theme";
import shadcn4Styles from "@sjsf/shadcn4-theme/styles.css?inline";
import "@sjsf/shadcn4-theme/extra-widgets/checkboxes-include";
import "@sjsf/shadcn4-theme/extra-widgets/combobox-include";
import "@sjsf/shadcn4-theme/extra-widgets/date-picker-include";
import "@sjsf/shadcn4-theme/extra-widgets/file-include";
import "@sjsf/shadcn4-theme/extra-widgets/multi-select-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-buttons-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-include";
import "@sjsf/shadcn4-theme/extra-widgets/range-include";
import "@sjsf/shadcn4-theme/extra-widgets/switch-include";
import "@sjsf/shadcn4-theme/extra-widgets/textarea-include";

type ArrayAssert<T extends SchemaValue> = (
  arr: SchemaArrayValue | undefined
) => asserts arr is T[] | undefined;

function createArrayAssert<T extends SchemaValue>(
  itemName: string,
  isItem: (v: SchemaValue) => v is T
) {
  return (
    arr: SchemaArrayValue | undefined
  ): asserts arr is T[] | undefined => {
    if (
      arr !== undefined &&
      arr.findIndex((item) => item === undefined || !isItem(item)) !== -1
    ) {
      throw new TypeError(`expected array of "${itemName}"`);
    }
  };
}

const assertStrings: ArrayAssert<string> = createArrayAssert(
  "string",
  (v: SchemaValue): v is string => typeof v === "string"
);

const assertFiles: ArrayAssert<File> = createArrayAssert(
  "File",
  (v): v is File => v instanceof File
);

const filesFieldWrapper = cast(FilesField, {
  value: {
    transform(props) {
      assertStrings(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;

const nativeFileWrapper = cast(NativeFileField, {
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

const nativeFilesWrapper = cast(NativeFilesField, {
  value: {
    transform(props) {
      assertFiles(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;

const tagsFieldWrapper = cast(TagsField, {
  value: {
    transform(props) {
      assertStrings(props.value);
      return props.value;
    },
  },
}) satisfies ComponentDefinition<"arrayField">;

const wrappers = {
  filesFieldWrapper,
  nativeFileWrapper,
  nativeFilesWrapper,
  tagsFieldWrapper,
} as const;

export const themes = {
  basic: extendByRecord(basic, wrappers),
  daisy5: extendByRecord(daisy5, wrappers),
  flowbite3: extendByRecord(flowbite3, wrappers),
  skeleton3: extendByRecord(skeleton3, wrappers),
  shadcn4: extendByRecord(shadcn4, wrappers),
};

export const themeStyles = {
  basic: "",
  daisy5: daisy5Styles,
  flowbite3: flowbite3Styles,
  skeleton3: skeleton3Styles,
  shadcn4: shadcn4Styles,
} satisfies Record<keyof typeof themes, string>;
