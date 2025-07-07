import { extendByRecord } from "@sjsf/form/lib/resolver";
import type { ComponentType, SchemaValue } from "@sjsf/form";
import type { Options, WidgetCommonProps } from "@sjsf/form/fields/widgets";

import "@sjsf/form/fields/extra-fields/boolean-select-include";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import "@sjsf/form/fields/extra-fields/files-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";
import "@sjsf/form/fields/extra-fields/tags-include";

export { theme as basic } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";
import "@sjsf/basic-theme/extra-widgets/date-picker-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/multi-select-include";
import "@sjsf/basic-theme/extra-widgets/radio-include";
import "@sjsf/basic-theme/extra-widgets/range-include";
import "@sjsf/basic-theme/extra-widgets/textarea-include";

import { theme as daisy5base } from "@sjsf/daisyui5-theme";
export { default as daisy5Styles } from "@sjsf/daisyui5-theme/styles.css?raw";

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

export const daisyui5 = extendByRecord(daisy5base, {
  filterRadioButtonsWidget: FilterRadioButtons,
  pikadayDatePickerWidget: PikadayDatePicker,
});

export const daisyui5conflicts: ComponentType[][] = [
  ["radioButtonsWidget", "filterRadioButtonsWidget"],
  ["datePickerWidget", "pikadayDatePickerWidget"],
];

export { theme as flowbite3 } from "@sjsf/flowbite3-theme";
export { default as flowbite3Styles } from "@sjsf/flowbite3-theme/styles.css?inline";
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
export { default as skeleton3Styles } from "@sjsf/skeleton3-theme/styles.css?inline";
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

export const skeleton3 = extendByRecord(skeleton3base, {
  fileUploadWidget: FileUpload,
  sliderWidget: Slider,
});

export const skeleton3conflicts: ComponentType[][] = [
  ["fileWidget", "fileUploadWidget"],
  ["rangeWidget", "sliderWidget"],
];

export { theme as shadcn4 } from "@sjsf/shadcn4-theme";
export { default as shadcn4Styles } from "@sjsf/shadcn4-theme/styles.css?inline";
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
