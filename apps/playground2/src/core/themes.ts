import "@sjsf/form/fields/extra-fields/boolean-select-include";
import "@sjsf/form/fields/extra-fields/enum-include";
import "@sjsf/form/fields/extra-fields/file-include";
import "@sjsf/form/fields/extra-fields/files-include";
import "@sjsf/form/fields/extra-fields/multi-enum-include";

import { theme as basic } from "@sjsf/basic-theme";
import '@sjsf/basic-theme/extra-widgets/checkboxes-include';
import '@sjsf/basic-theme/extra-widgets/file-include';
import "@sjsf/basic-theme/extra-widgets/multi-select-include";
import "@sjsf/basic-theme/extra-widgets/textarea-include";
import "@sjsf/basic-theme/extra-widgets/radio-include";
import "@sjsf/basic-theme/extra-widgets/range-include";
import "@sjsf/basic-theme/extra-widgets/date-picker-include";

import { theme as daisy5 } from "@sjsf/daisyui5-theme";
import daisy5Styles from "@sjsf/daisyui5-theme/styles.css?raw";
import '@sjsf/daisyui5-theme/extra-widgets/checkboxes-include';
import '@sjsf/daisyui5-theme/extra-widgets/file-include';
import "@sjsf/daisyui5-theme/extra-widgets/multi-select-include";
import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-include";
import "@sjsf/daisyui5-theme/extra-widgets/range-include";
import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include";

import { theme as flowbite3 } from "@sjsf/flowbite3-theme";
import flowbite3Styles from "@sjsf/flowbite3-theme/styles.css?inline";
import '@sjsf/flowbite3-theme/extra-widgets/checkboxes-include';
import '@sjsf/flowbite3-theme/extra-widgets/file-include';
import "@sjsf/flowbite3-theme/extra-widgets/multi-select-include";
import "@sjsf/flowbite3-theme/extra-widgets/textarea-include";
import "@sjsf/flowbite3-theme/extra-widgets/radio-include";
import "@sjsf/flowbite3-theme/extra-widgets/range-include";
import "@sjsf/flowbite3-theme/extra-widgets/date-picker-include";

import { theme as skeleton3 } from '@sjsf/skeleton3-theme'
import skeleton3Styles from "@sjsf/skeleton3-theme/styles.css?inline";
import '@sjsf/skeleton3-theme/extra-widgets/checkboxes-include';
import '@sjsf/skeleton3-theme/extra-widgets/file-include';
import "@sjsf/skeleton3-theme/extra-widgets/multi-select-include";
import "@sjsf/skeleton3-theme/extra-widgets/textarea-include";
import "@sjsf/skeleton3-theme/extra-widgets/radio-include";
import "@sjsf/skeleton3-theme/extra-widgets/range-include";
import "@sjsf/skeleton3-theme/extra-widgets/date-picker-include";

import { theme as shadcn4 } from "@sjsf/shadcn4-theme";
import shadcn4Styles from "@sjsf/shadcn4-theme/styles.css?inline";
import '@sjsf/shadcn4-theme/extra-widgets/checkboxes-include';
import '@sjsf/shadcn4-theme/extra-widgets/file-include';
import "@sjsf/shadcn4-theme/extra-widgets/multi-select-include";
import "@sjsf/shadcn4-theme/extra-widgets/textarea-include";
import "@sjsf/shadcn4-theme/extra-widgets/radio-include";
import "@sjsf/shadcn4-theme/extra-widgets/range-include";
import "@sjsf/shadcn4-theme/extra-widgets/date-picker-include";

export const themes = {
  basic,
  daisy5,
  flowbite3,
  skeleton3,
  shadcn4
};

export const themeStyles = {
  basic: "",
  daisy5: daisy5Styles,
  flowbite3: flowbite3Styles,
  skeleton3: skeleton3Styles,
  shadcn4: shadcn4Styles
} satisfies Record<keyof typeof themes, string>;
