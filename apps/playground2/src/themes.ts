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
import "@sjsf/basic-theme/extra-widgets/date-picker-include";

import { theme as daisy } from "@sjsf/daisyui-theme";
import daisyStyles from "@sjsf/daisyui-theme/styles.css?inline";
import '@sjsf/daisyui-theme/extra-widgets/checkboxes-include';
import '@sjsf/daisyui-theme/extra-widgets/file-include';
import "@sjsf/daisyui-theme/extra-widgets/multi-select-include";
import "@sjsf/daisyui-theme/extra-widgets/textarea-include";
import "@sjsf/daisyui-theme/extra-widgets/radio-include";
import "@sjsf/daisyui-theme/extra-widgets/date-picker-include";

import { theme as daisy5 } from "@sjsf/daisyui5-theme";
import daisy5Styles from "@sjsf/daisyui5-theme/styles.css?raw";
import '@sjsf/daisyui5-theme/extra-widgets/checkboxes-include';
import '@sjsf/daisyui5-theme/extra-widgets/file-include';
import "@sjsf/daisyui5-theme/extra-widgets/multi-select-include";
import "@sjsf/daisyui5-theme/extra-widgets/textarea-include";
import "@sjsf/daisyui5-theme/extra-widgets/radio-include";
import "@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include";

import { theme as flowbite } from "@sjsf/flowbite-theme";
import flowbiteStyles from "@sjsf/flowbite-theme/styles.css?inline";
import '@sjsf/flowbite-theme/extra-widgets/checkboxes-include';
import '@sjsf/flowbite-theme/extra-widgets/file-include';
import "@sjsf/flowbite-theme/extra-widgets/multi-select-include";
import "@sjsf/flowbite-theme/extra-widgets/textarea-include";
import "@sjsf/flowbite-theme/extra-widgets/radio-include";
import "@sjsf/flowbite-theme/extra-widgets/date-picker-include";

import { theme as skeleton } from "@sjsf/skeleton-theme";
import skeletonStyles from "@sjsf/skeleton-theme/styles.css?inline";
import '@sjsf/skeleton-theme/extra-widgets/checkboxes-include';
import '@sjsf/skeleton-theme/extra-widgets/file-include';
import "@sjsf/skeleton-theme/extra-widgets/multi-select-include";
import "@sjsf/skeleton-theme/extra-widgets/textarea-include";
import "@sjsf/skeleton-theme/extra-widgets/radio-include";
import "@sjsf/skeleton-theme/extra-widgets/date-picker-include";

import { theme as shadcn } from "@sjsf/shadcn-theme";
import shadcnStyles from "@sjsf/shadcn-theme/styles.css?inline";
import '@sjsf/shadcn-theme/extra-widgets/checkboxes-include';
import '@sjsf/shadcn-theme/extra-widgets/file-include';
import "@sjsf/shadcn-theme/extra-widgets/multi-select-include";
import "@sjsf/shadcn-theme/extra-widgets/textarea-include";
import "@sjsf/shadcn-theme/extra-widgets/radio-include";
import "@sjsf/shadcn-theme/extra-widgets/date-picker-include";

export const themes = {
  basic,
  daisy,
  daisy5,
  flowbite,
  skeleton,
  shadcn,
};

export const themeStyles = {
  basic: "",
  daisy: daisyStyles,
  daisy5: daisy5Styles,
  flowbite: flowbiteStyles,
  skeleton: skeletonStyles,
  shadcn: shadcnStyles,
} satisfies Record<keyof typeof themes, string>;
