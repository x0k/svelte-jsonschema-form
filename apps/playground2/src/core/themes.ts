import "@sjsf/form/fields/extra/boolean-select-include";
import "@sjsf/form/fields/extra/enum-include";
import "@sjsf/form/fields/extra/file-include";
import "@sjsf/form/fields/extra/files-include";
import "@sjsf/form/fields/extra/multi-enum-include";
import "@sjsf/form/fields/extra/tags-include";
import "@sjsf/form/fields/extra/array-files-include";
import "@sjsf/form/fields/extra/unknown-native-file-include";
import "@sjsf/form/fields/extra/array-native-files-include";
import "@sjsf/form/fields/extra/array-tags-include";

import { theme as basic } from "@sjsf/basic-theme";
import "@sjsf/basic-theme/extra-widgets/checkboxes-include";
import "@sjsf/basic-theme/extra-widgets/date-picker-include";
import "@sjsf/basic-theme/extra-widgets/file-include";
import "@sjsf/basic-theme/extra-widgets/multi-select-include";
import "@sjsf/basic-theme/extra-widgets/radio-include";
import "@sjsf/basic-theme/extra-widgets/range-include";
import "@sjsf/basic-theme/extra-widgets/textarea-include";

import { theme as daisy5 } from "@sjsf/daisyui5-theme";
import daisy5Styles from "@sjsf/daisyui5-theme/styles.css?raw";
import "@sjsf/daisyui5-theme/extra-widgets/date-picker-include";
import "@sjsf/daisyui5-theme/extra-widgets/checkboxes-include";
import "@sjsf/daisyui5-theme/extra-widgets/file-include";
import "@sjsf/daisyui5-theme/extra-widgets/multi-select-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-buttons-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-include";
import "@sjsf/daisyui5-theme/extra-widgets/range-include";
import "@sjsf/daisyui5-theme/extra-widgets/rating-include";
import "@sjsf/daisyui5-theme/extra-widgets/switch-include";
import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";
import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include";
import "@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons-include";

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
import "@sjsf/flowbite3-theme/extra-widgets/toggle-radio-buttons-include";

import { theme as skeleton4 } from "@sjsf/skeleton4-theme";
import skeleton4Styles from "@sjsf/skeleton4-theme/styles.css?inline";
import "@sjsf/skeleton4-theme/extra-widgets/checkboxes-include";
import "@sjsf/skeleton4-theme/extra-widgets/date-picker-include";
import "@sjsf/skeleton4-theme/extra-widgets/file-include";
import "@sjsf/skeleton4-theme/extra-widgets/multi-select-include";
import "@sjsf/skeleton4-theme/extra-widgets/radio-buttons-include";
import "@sjsf/skeleton4-theme/extra-widgets/radio-include";
import "@sjsf/skeleton4-theme/extra-widgets/range-include";
import "@sjsf/skeleton4-theme/extra-widgets/rating-include";
import "@sjsf/skeleton4-theme/extra-widgets/switch-include";
import "@sjsf/skeleton4-theme/extra-widgets/tags-include";
import "@sjsf/skeleton4-theme/extra-widgets/textarea-include";
import "@sjsf/skeleton4-theme/extra-widgets/file-upload-include";
import "@sjsf/skeleton4-theme/extra-widgets/slider-include";
import "@sjsf/skeleton4-theme/extra-widgets/combobox-include";

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

export const themes = {
  basic,
  daisy5,
  flowbite3,
  skeleton4,
  shadcn4,
};

export const themeStyles = {
  basic: "",
  daisy5: daisy5Styles,
  flowbite3: flowbite3Styles,
  skeleton4: skeleton4Styles,
  shadcn4: shadcn4Styles,
} satisfies Record<keyof typeof themes, string>;
